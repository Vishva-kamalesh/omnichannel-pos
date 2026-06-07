const mongoose = require("mongoose");
const Order = require("./order.model");
const Product = require("../products/product.model");
const Inventory = require("../inventory/inventory.model");
const InventoryLog = require("../inventory/inventoryLog.model");
const ApiError = require("../../utils/ApiError");

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

/**
 * Create an order. Validates stock, decrements inventory, writes order + logs
 * inside a transaction so we never sell what we don't have.
 */
const createOrder = async (data, user) => {
  const { storeId, items, paymentMethod, tax = 0, discount = 0, customerId, notes } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    if (products.length !== items.length) {
      throw new ApiError(400, "One or more products not found");
    }

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    let totalAmount = 0;
    let totalCost = 0;

    for (const line of items) {
      const product = productMap.get(line.productId);
      if (!product || !product.isActive) {
        throw new ApiError(400, `Product ${line.productId} is not available`);
      }

      const inventory = await Inventory.findOne({
        productId: product._id,
        storeId,
      }).session(session);

      if (!inventory || inventory.quantity < line.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name} (SKU: ${product.sku})`
        );
      }

      const subtotal = product.price * line.quantity;
      totalAmount += subtotal;
      totalCost += product.costPrice * line.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: line.quantity,
        price: product.price,
        costPrice: product.costPrice,
        subtotal,
      });

      const previousQuantity = inventory.quantity;
      inventory.quantity -= line.quantity;
      inventory.lastUpdatedBy = user._id;
      await inventory.save({ session });

      await InventoryLog.create(
        [
          {
            productId: product._id,
            storeId,
            actionType: "OUT",
            quantity: line.quantity,
            previousQuantity,
            newQuantity: inventory.quantity,
            performedBy: user._id,
            remarks: "Sold via POS",
          },
        ],
        { session }
      );
    }

    const finalAmount = Math.max(0, totalAmount + tax - discount);

    const [order] = await Order.create(
      [
        {
          orderNumber: generateOrderNumber(),
          items: orderItems,
          totalAmount,
          totalCost,
          tax,
          discount,
          finalAmount,
          paymentMethod,
          paymentStatus: "paid",
          status: "completed",
          storeId,
          cashierId: user._id,
          customerId,
          notes,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getOrders = async (query) => {
  const {
    page = 1,
    limit = 10,
    storeId,
    cashierId,
    status,
    paymentMethod,
    startDate,
    endDate,
    search,
  } = query;

  const filter = {};
  if (storeId) filter.storeId = storeId;
  if (cashierId) filter.cashierId = cashierId;
  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (search) filter.orderNumber = { $regex: search, $options: "i" };

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("cashierId", "name email role")
      .populate("storeId", "name location")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("cashierId", "name email role")
    .populate("storeId", "name location")
    .populate("customerId", "name email");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};

/**
 * Refund a completed order. Restocks every item and marks the order refunded.
 */
const refundOrder = async (id, reason, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    if (order.status !== "completed") {
      throw new ApiError(400, "Only completed orders can be refunded");
    }

    for (const item of order.items) {
      let inventory = await Inventory.findOne({
        productId: item.productId,
        storeId: order.storeId,
      }).session(session);

      const previousQuantity = inventory ? inventory.quantity : 0;

      if (!inventory) {
        inventory = new Inventory({
          productId: item.productId,
          storeId: order.storeId,
          quantity: item.quantity,
          lastUpdatedBy: user._id,
        });
      } else {
        inventory.quantity += item.quantity;
        inventory.lastUpdatedBy = user._id;
      }
      await inventory.save({ session });

      await InventoryLog.create(
        [
          {
            productId: item.productId,
            storeId: order.storeId,
            actionType: "IN",
            quantity: item.quantity,
            previousQuantity,
            newQuantity: previousQuantity + item.quantity,
            performedBy: user._id,
            remarks: `Refund for order ${order.orderNumber}: ${reason}`,
          },
        ],
        { session }
      );
    }

    order.status = "returned";
    order.paymentStatus = "refunded";
    order.notes = order.notes
      ? `${order.notes}\nRefund: ${reason}`
      : `Refund: ${reason}`;
    await order.save({ session });

    await session.commitTransaction();
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  refundOrder,
};
