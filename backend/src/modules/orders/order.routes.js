const express = require("express");
const orderController = require("./order.controller");
const orderValidation = require("./order.validation");
const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../auth/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: POS sales and refunds
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order (checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: List orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router
  .route("/")
  .post(
    authorize("admin", "manager", "cashier"),
    validate(orderValidation.createOrderSchema),
    orderController.createOrder
  )
  .get(authorize("admin", "manager", "cashier"), orderController.getOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  authorize("admin", "manager", "cashier"),
  orderController.getOrderById
);

/**
 * @swagger
 * /api/v1/orders/{id}/refund:
 *   post:
 *     summary: Refund an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/:id/refund",
  authorize("admin", "manager"),
  validate(orderValidation.refundOrderSchema),
  orderController.refundOrder
);

module.exports = router;
