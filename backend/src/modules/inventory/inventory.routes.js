const express = require("express");
const inventoryController = require("./inventory.controller.js");
const inventoryValidation = require("./inventory.validation.js");
const validate = require("../../middlewares/validate.middleware.js");
const { protect } = require("../auth/auth.middleware.js");
const authorize = require("../../middlewares/role.middleware.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management and stock tracking
 */

/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory records
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         description: Filter by Store ID
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  protect,
  authorize("admin", "manager", "cashier"),
  inventoryController.getAllInventory
);

/**
 * @swagger
 * /api/v1/inventory/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         description: Filter low stock by specific store
 *     responses:
 *       200:
 *         description: Low stock products fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/low-stock",
  protect,
  authorize("admin", "manager"),
  validate(inventoryValidation.getLowStock),
  inventoryController.getLowStock
);

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get inventory record by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *       404:
 *         description: Inventory record not found
 */
router.get(
  "/:id",
  protect,
  authorize("admin", "manager", "cashier"),
  inventoryController.getInventoryById
);

/**
 * @swagger
 * /api/v1/inventory/product/{productId}:
 *   get:
 *     summary: Get inventory for a specific product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         description: Optionally filter by specific store
 *     responses:
 *       200:
 *         description: Product inventory fetched successfully
 */
router.get(
  "/product/:productId",
  protect,
  authorize("admin", "manager", "cashier"),
  inventoryController.getProductInventory
);

/**
 * @swagger
 * /api/v1/inventory/increment:
 *   patch:
 *     summary: Increment stock (New arrivals)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - storeId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               storeId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock incremented successfully
 *       400:
 *         description: Validation error
 */
router.patch(
  "/increment",
  protect,
  authorize("admin", "manager"),
  validate(inventoryValidation.updateStock),
  inventoryController.incrementStock
);

/**
 * @swagger
 * /api/v1/inventory/decrement:
 *   patch:
 *     summary: Decrement stock (Sales/Damaged)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - storeId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               storeId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock decremented successfully
 *       400:
 *         description: Insufficient stock or validation error
 */
router.patch(
  "/decrement",
  protect,
  authorize("admin", "manager"),
  validate(inventoryValidation.updateStock),
  inventoryController.decrementStock
);

/**
 * @swagger
 * /api/v1/inventory/transfer:
 *   post:
 *     summary: Transfer stock between stores
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - fromStoreId
 *               - toStoreId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               fromStoreId:
 *                 type: string
 *               toStoreId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock transferred successfully
 *       400:
 *         description: Insufficient stock or same store error
 */
router.post(
  "/transfer",
  protect,
  authorize("admin", "manager"),
  validate(inventoryValidation.transferStock),
  inventoryController.transferStock
);

module.exports = router;
