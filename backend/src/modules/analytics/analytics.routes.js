const express = require("express");
const router = express.Router();
const analyticsController = require("./analytics.controller");
const { protect } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard summary
 * @access  Admin, Manager
 */
router.get(
  "/dashboard",
  authorize("admin", "manager"),
  analyticsController.getDashboardSummary
);

/**
 * @route   GET /api/v1/analytics/sales/:type
 * @desc    Get sales analytics (daily, weekly, monthly, yearly)
 * @access  Admin, Manager
 */
router.get(
  "/sales/:type",
  authorize("admin", "manager"),
  analyticsController.getSalesAnalytics
);

/**
 * @route   GET /api/v1/analytics/top-products
 * @desc    Get top selling products
 * @access  Admin, Manager
 */
router.get(
  "/top-products",
  authorize("admin", "manager"),
  analyticsController.getTopProducts
);

/**
 * @route   GET /api/v1/analytics/inventory-stats
 * @desc    Get inventory valuation and low stock alerts
 * @access  Admin, Manager
 */
router.get(
  "/inventory-stats",
  authorize("admin", "manager"),
  analyticsController.getInventoryAnalytics
);

/**
 * @route   GET /api/v1/analytics/store-performance
 * @desc    Get performance metrics per store
 * @access  Admin
 */
router.get(
  "/store-performance",
  authorize("admin"),
  analyticsController.getStorePerformance
);

/**
 * @route   GET /api/v1/analytics/cashier-performance
 * @desc    Get sales performance per cashier
 * @access  Admin, Manager
 */
router.get(
  "/cashier-performance",
  authorize("admin", "manager"),
  analyticsController.getCashierPerformance
);

/**
 * @route   GET /api/v1/analytics/revenue-report
 * @desc    Get custom date range revenue report
 * @access  Admin
 */
router.get(
  "/revenue-report",
  authorize("admin"),
  analyticsController.getRevenueReport
);

module.exports = router;
