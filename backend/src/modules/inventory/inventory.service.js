const mongoose = require("mongoose");
const Inventory = require("./inventory.model.js");
const InventoryLog = require("./inventoryLog.model.js");
const ApiError = require("../../utils/ApiError");
const { inventoryCache } = require("./inventory.utils.js");

class InventoryService {
  /**
   * @description Get inventory with filters and pagination
   */
  async getInventory(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const inventory = await Inventory.find(filters)
      .populate("productId", "name sku barcode price")
      .populate("storeId", "name location")
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const total = await Inventory.countDocuments(filters);

    return {
      inventory,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * @description Get specific product inventory in a store
   */
  async getProductInventory(productId, storeId) {
    // Try cache first
    let inventory = await inventoryCache.get(productId, storeId);
    if (inventory) return inventory;

    inventory = await Inventory.findOne({ productId, storeId })
      .populate("productId", "name sku barcode")
      .populate("storeId", "name");

    if (inventory) {
      await inventoryCache.set(productId, storeId, inventory);
    }

    return inventory;
  }

  /**
   * @description Increment stock (New arrivals / returns)
   */
  async incrementStock(data, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { productId, storeId, quantity, remarks = "Stock increment" } = data;

      let inventory = await Inventory.findOne({ productId, storeId }).session(session);

      const previousQuantity = inventory ? inventory.quantity : 0;

      if (!inventory) {
        inventory = new Inventory({
          productId,
          storeId,
          quantity,
          lastUpdatedBy: userId,
        });
      } else {
        inventory.quantity += quantity;
        inventory.lastUpdatedBy = userId;
      }

      await inventory.save({ session });

      // Create log
      await InventoryLog.create(
        [
          {
            productId,
            storeId,
            actionType: "IN",
            quantity,
            previousQuantity,
            newQuantity: previousQuantity + quantity,
            performedBy: userId,
            remarks,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      
      // Invalidate cache
      await inventoryCache.invalidate(productId, storeId);

      return inventory;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * @description Decrement stock (Sales)
   */
  async decrementStock(data, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { productId, storeId, quantity, remarks = "Stock decrement" } = data;

      const inventory = await Inventory.findOne({ productId, storeId }).session(session);

      if (!inventory || inventory.quantity < quantity) {
        throw new ApiError(400, "Insufficient stock available");
      }

      const previousQuantity = inventory.quantity;
      inventory.quantity -= quantity;
      inventory.lastUpdatedBy = userId;

      await inventory.save({ session });

      // Create log
      await InventoryLog.create(
        [
          {
            productId,
            storeId,
            actionType: "OUT",
            quantity,
            previousQuantity,
            newQuantity: previousQuantity - quantity,
            performedBy: userId,
            remarks,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      
      // Invalidate cache
      await inventoryCache.invalidate(productId, storeId);

      return inventory;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * @description Transfer stock between stores
   */
  async transferStock(data, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { productId, fromStoreId, toStoreId, quantity, remarks = "Inter-store transfer" } = data;

      if (fromStoreId === toStoreId) {
        throw new ApiError(400, "Source and destination stores cannot be the same");
      }

      // 1. Decrement from source
      const sourceInventory = await Inventory.findOne({ productId, storeId: fromStoreId }).session(session);

      if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new ApiError(400, "Insufficient stock in source store");
      }

      const sourcePrevQty = sourceInventory.quantity;
      sourceInventory.quantity -= quantity;
      sourceInventory.lastUpdatedBy = userId;
      await sourceInventory.save({ session });

      // 2. Increment at destination
      let destInventory = await Inventory.findOne({ productId, storeId: toStoreId }).session(session);
      const destPrevQty = destInventory ? destInventory.quantity : 0;

      if (!destInventory) {
        destInventory = new Inventory({
          productId,
          storeId: toStoreId,
          quantity,
          lastUpdatedBy: userId,
        });
      } else {
        destInventory.quantity += quantity;
        destInventory.lastUpdatedBy = userId;
      }
      await destInventory.save({ session });

      // 3. Create Logs
      await InventoryLog.create(
        [
          {
            productId,
            storeId: fromStoreId,
            actionType: "TRANSFER_OUT",
            quantity,
            previousQuantity: sourcePrevQty,
            newQuantity: sourcePrevQty - quantity,
            performedBy: userId,
            remarks,
            metadata: { toStoreId },
          },
          {
            productId,
            storeId: toStoreId,
            actionType: "TRANSFER_IN",
            quantity,
            previousQuantity: destPrevQty,
            newQuantity: destPrevQty + quantity,
            performedBy: userId,
            remarks,
            metadata: { fromStoreId },
          },
        ],
        { session }
      );

      await session.commitTransaction();

      // Invalidate caches
      await inventoryCache.invalidate(productId, fromStoreId);
      await inventoryCache.invalidate(productId, toStoreId);

      return { sourceInventory, destInventory };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * @description Get products with low stock
   */
  async getLowStockProducts(storeId) {
    // Try cache
    let lowStock = await inventoryCache.getLowStock(storeId);
    if (lowStock) return lowStock;

    const query = {
      $expr: { $lte: ["$quantity", "$minimumStockLevel"] },
    };

    if (storeId) {
      query.storeId = storeId;
    }

    lowStock = await Inventory.find(query)
      .populate("productId", "name sku barcode")
      .populate("storeId", "name");

    await inventoryCache.setLowStock(storeId, lowStock);
    return lowStock;
  }

  /**
   * @description Reserve stock for pending orders
   */
  async reserveStock(productId, storeId, quantity, userId, session) {
    const inventory = await Inventory.findOne({ productId, storeId }).session(session);

    if (!inventory || (inventory.quantity - inventory.reservedStock) < quantity) {
      throw new ApiError(400, "Insufficient available stock for reservation");
    }

    inventory.reservedStock += quantity;
    inventory.lastUpdatedBy = userId;
    await inventory.save({ session });

    await InventoryLog.create([{
      productId,
      storeId,
      actionType: "RESERVATION",
      quantity,
      previousQuantity: inventory.quantity,
      newQuantity: inventory.quantity, // Quantity doesn't change, just reservedStock
      performedBy: userId,
      remarks: "Stock reserved for order",
    }], { session });

    await inventoryCache.invalidate(productId, storeId);
    return inventory;
  }
}

module.exports = new InventoryService();
