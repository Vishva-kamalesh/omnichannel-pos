const express = require("express");
const productController = require("./product.controller");
const productValidation = require("./product.validation");
const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../auth/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private (Admin/Manager/Cashier)
 * 
 * @route   GET /api/v1/products
 * @desc    Get all products (with search, pagination, filtering)
 * @access  Private
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
 * @route   GET /api/v1/products/barcode/:barcode
 * @desc    Get product by barcode (Optimized for POS scanning)
 * @access  Private
 */
router.get(
  "/barcode/:barcode",
  protect,
  productController.getProductByBarcode
);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Private
 * 
 * @route   PUT /api/v1/products/:id
 * @desc    Update product details
 * @access  Private
 * 
 * @route   DELETE /api/v1/products/:id
 * @desc    Soft delete a product
 * @access  Private (Admin/Manager)
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
