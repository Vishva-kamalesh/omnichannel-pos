const Order = require("../orders/order.model");
const Product = require("../products/product.model");
const Inventory = require("../inventory/inventory.model");
const User = require("../users/user.model");
const Store = require("../stores/store.model");
const redisService = require("../../services/redis.service");
const { getDateRange } = require("./analytics.utils");

class AnalyticsService {
  /**
   * @description Get high-level dashboard summary
   */
  async getDashboardSummary() {
    const cacheKey = "analytics:dashboard_summary";
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) return cachedData;

    const [
      revenueData,
      totalProducts,
      totalOrders,
      lowStockCount,
      totalStores,
      activeCashiers,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$finalAmount" } } },
      ]),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ status: "completed" }),
      Inventory.countDocuments({
        $expr: { $lte: ["$quantity", "$minimumStockLevel"] },
      }),
      Store.countDocuments({ isActive: true }),
      User.countDocuments({ role: "cashier", isActive: true }),
    ]);

    const summary = {
      totalRevenue: revenueData[0]?.total || 0,
      totalOrders,
      totalProducts,
      lowStockProducts: lowStockCount,
      totalStores,
      totalActiveCashiers: activeCashiers,
    };

    await redisService.set(cacheKey, summary, 300); // Cache for 5 mins
    return summary;
  }

  /**
   * @description Get sales trends by interval
   */
  async getSalesAnalytics(type = "daily") {
    const { startDate, endDate } = getDateRange(type);
    const cacheKey = `analytics:sales:${type}`;
    
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) return cachedData;

    const pipeline = [
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: type === "yearly" ? "%Y-%m" : "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          sales: { $sum: "$finalAmount" },
          orders: { $count: {} },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          sales: 1,
          orders: 1,
          _id: 0,
        },
      },
    ];

    const results = await Order.aggregate(pipeline);
    await redisService.set(cacheKey, results, 600); // Cache for 10 mins
    return results;
  }

  /**
   * @description Get top selling products
   */
  async getTopProducts(limit = 10) {
    const cacheKey = `analytics:top_products:${limit}`;
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) return cachedData;

    const pipeline = [
      { $match: { status: "completed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sku: { $first: "$items.sku" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
    ];

    const results = await Order.aggregate(pipeline);
    await redisService.set(cacheKey, results, 1800); // Cache for 30 mins
    return results;
  }

  /**
   * @description Get inventory value and low stock products
   */
  async getInventoryAnalytics() {
    const cacheKey = "analytics:inventory_stats";
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) return cachedData;

    const [inventoryValue, lowStockProducts] = await Promise.all([
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $multiply: ["$stock", "$costPrice"] } },
          },
        },
      ]),
      Inventory.find({
        $expr: { $lte: ["$quantity", "$minimumStockLevel"] },
      })
        .populate("productId", "name sku")
        .populate("storeId", "name")
        .limit(20),
    ]);

    const results = {
      totalInventoryValue: inventoryValue[0]?.totalValue || 0,
      lowStockItems: lowStockProducts.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        sku: item.productId.sku,
        currentStock: item.quantity,
        minLevel: item.minimumStockLevel,
        store: item.storeId.name,
      })),
    };

    await redisService.set(cacheKey, results, 300);
    return results;
  }

  /**
   * @description Get performance metrics for each store
   */
  async getStorePerformance() {
    const cacheKey = "analytics:store_performance";
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) return cachedData;

    const pipeline = [
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$storeId",
          totalRevenue: { $sum: "$finalAmount" },
          totalOrders: { $count: {} },
          avgOrderValue: { $avg: "$finalAmount" },
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "_id",
          as: "storeDetails",
        },
      },
      { $unwind: "$storeDetails" },
      {
        $project: {
          storeId: "$_id",
          storeName: "$storeDetails.name",
          totalRevenue: 1,
          totalOrders: 1,
          avgOrderValue: { $round: ["$avgOrderValue", 2] },
          _id: 0,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];

    const results = await Order.aggregate(pipeline);
    await redisService.set(cacheKey, results, 900);
    return results;
  }

  /**
   * @description Get performance metrics for each cashier
   */
  async getCashierPerformance() {
    const pipeline = [
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$cashierId",
          totalRevenue: { $sum: "$finalAmount" },
          totalOrders: { $count: {} },
          totalRefunds: {
            $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "cashierDetails",
        },
      },
      { $unwind: "$cashierDetails" },
      {
        $project: {
          cashierId: "$_id",
          cashierName: "$cashierDetails.name",
          totalRevenue: 1,
          totalOrders: 1,
          totalRefunds: 1,
          avgTransactionValue: { $divide: ["$totalRevenue", "$totalOrders"] },
          _id: 0,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];

    return await Order.aggregate(pipeline);
  }

  /**
   * @description Get detailed revenue report for custom date range
   */
  async getRevenueReport(startDate, endDate) {
    const pipeline = [
      {
        $match: {
          status: "completed",
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalAmount" },
          totalCost: { $sum: "$totalCost" },
          totalDiscount: { $sum: "$discount" },
          totalTax: { $sum: "$tax" },
          orderCount: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalCost: 1,
          grossProfit: { $subtract: ["$totalRevenue", "$totalCost"] },
          totalDiscount: 1,
          totalTax: 1,
          orderCount: 1,
        },
      },
    ];

    const results = await Order.aggregate(pipeline);
    return results[0] || { totalRevenue: 0, totalCost: 0, grossProfit: 0, totalDiscount: 0, totalTax: 0, orderCount: 0 };
  }
}

module.exports = new AnalyticsService();
