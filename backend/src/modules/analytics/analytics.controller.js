const analyticsService = require("./analytics.service");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

/**
 * @desc    Get Dashboard Summary
 * @route   GET /api/v1/analytics/dashboard
 * @access  Private (Admin, Manager)
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await analyticsService.getDashboardSummary();
  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Dashboard analytics fetched successfully"));
});

/**
 * @desc    Get Sales Analytics (Daily, Weekly, Monthly, Yearly)
 * @route   GET /api/v1/analytics/sales/:type
 * @access  Private (Admin, Manager)
 */
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const validTypes = ["daily", "weekly", "monthly", "yearly"];

  if (!validTypes.includes(type)) {
    throw new ApiError(400, "Invalid analytics type. Use daily, weekly, monthly, or yearly.");
  }

  const salesData = await analyticsService.getSalesAnalytics(type);
  return res
    .status(200)
    .json(new ApiResponse(200, salesData, `${type.charAt(0).toUpperCase() + type.slice(1)} sales analytics fetched successfully`));
});

/**
 * @desc    Get Top Selling Products
 * @route   GET /api/v1/analytics/top-products
 * @access  Private (Admin, Manager)
 */
const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topProducts = await analyticsService.getTopProducts(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, topProducts, "Top selling products fetched successfully"));
});

/**
 * @desc    Get Inventory Analytics (Value and Low Stock)
 * @route   GET /api/v1/analytics/inventory-stats
 * @access  Private (Admin, Manager)
 */
const getInventoryAnalytics = asyncHandler(async (req, res) => {
  const inventoryStats = await analyticsService.getInventoryAnalytics();
  return res
    .status(200)
    .json(new ApiResponse(200, inventoryStats, "Inventory analytics fetched successfully"));
});

/**
 * @desc    Get Store Performance
 * @route   GET /api/v1/analytics/store-performance
 * @access  Private (Admin)
 */
const getStorePerformance = asyncHandler(async (req, res) => {
  const performance = await analyticsService.getStorePerformance();
  return res
    .status(200)
    .json(new ApiResponse(200, performance, "Store performance analytics fetched successfully"));
});

/**
 * @desc    Get Cashier Performance
 * @route   GET /api/v1/analytics/cashier-performance
 * @access  Private (Admin, Manager)
 */
const getCashierPerformance = asyncHandler(async (req, res) => {
  const performance = await analyticsService.getCashierPerformance();
  return res
    .status(200)
    .json(new ApiResponse(200, performance, "Cashier performance analytics fetched successfully"));
});

/**
 * @desc    Get Revenue Report for custom range
 * @route   GET /api/v1/analytics/revenue-report
 * @access  Private (Admin)
 */
const getRevenueReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, "Please provide both startDate and endDate (YYYY-MM-DD)");
  }

  const report = await analyticsService.getRevenueReport(startDate, endDate);
  return res
    .status(200)
    .json(new ApiResponse(200, report, "Revenue report generated successfully"));
});

module.exports = {
  getDashboardSummary,
  getSalesAnalytics,
  getTopProducts,
  getInventoryAnalytics,
  getStorePerformance,
  getCashierPerformance,
  getRevenueReport,
};
