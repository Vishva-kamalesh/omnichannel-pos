const express = require("express");
const productController = require("./product.controller");
const productValidation = require("./product.validation");
const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../auth/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, sku, category, price, costPrice, storeId]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               sku: { type: string }
 *               barcode: { type: string }
 *               category: { type: string }
 *               price: { type: number }
 *               costPrice: { type: number }
 *               storeId: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created successfully
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, SKU, or barcode
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of products fetched
 */
router
  .route("/")
  .post(
    protect,
    validate(productValidation.createProductSchema),
    productController.createProduct
  )
  .get(protect, productController.getAllProducts);

/**
 * @swagger
 * /api/v1/products/barcode/{barcode}:
 *   get:
 *     summary: Get product by barcode
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get(
  "/barcode/:barcode",
  protect,
  productController.getProductByBarcode
);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details retrieved
 *   put:
 *     summary: Update product details
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     summary: Soft delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router
  .route("/:id")
  .get(protect, productController.getProductById)
  .put(
    protect,
    validate(productValidation.updateProductSchema),
    productController.updateProduct
  )
  .delete(protect, productController.deleteProduct);

module.exports = router;
