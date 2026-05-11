const productService = require("./product.service");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

/**
 * @description Create product controller
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

/**
 * @description Get all products controller
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Products retrieved successfully"));
});

/**
 * @description Get product by ID controller
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

/**
 * @description Get product by barcode controller (for POS)
 */
const getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await productService.getProductByBarcode(req.params.barcode);
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product found successfully"));
});

/**
 * @description Update product controller
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

/**
 * @description Delete product controller
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByBarcode,
  updateProduct,
  deleteProduct,
};
