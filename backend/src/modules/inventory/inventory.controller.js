const inventoryService = require("./inventory.service.js");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

const inventoryController = {
  /**
   * @description Get all inventory
   */
  getAllInventory: asyncHandler(async (req, res) => {
    const { storeId, productId, page, limit } = req.query;
    const filters = {};
    if (storeId) filters.storeId = storeId;
    if (productId) filters.productId = productId;

    const result = await inventoryService.getInventory(filters, { page, limit });

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Inventory fetched successfully"));
  }),

  /**
   * @description Get inventory by ID
   */
  getInventoryById: asyncHandler(async (req, res) => {
    const inventory = await inventoryService.getInventory({ _id: req.params.id });
    if (!inventory.inventory.length) {
      throw new ApiError(404, "Inventory record not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, inventory.inventory[0], "Inventory fetched successfully"));
  }),

  /**
   * @description Get inventory for a specific product across all stores or a specific store
   */
  getProductInventory: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { storeId } = req.query;

    let result;
    if (storeId) {
      result = await inventoryService.getProductInventory(productId, storeId);
    } else {
      result = await inventoryService.getInventory({ productId });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Product inventory fetched successfully"));
  }),

  /**
   * @description Increment stock
   */
  incrementStock: asyncHandler(async (req, res) => {
    const result = await inventoryService.incrementStock(req.body, req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Stock incremented successfully"));
  }),

  /**
   * @description Decrement stock
   */
  decrementStock: asyncHandler(async (req, res) => {
    const result = await inventoryService.decrementStock(req.body, req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Stock decremented successfully"));
  }),

  /**
   * @description Transfer stock between stores
   */
  transferStock: asyncHandler(async (req, res) => {
    const result = await inventoryService.transferStock(req.body, req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Stock transferred successfully"));
  }),

  /**
   * @description Get low stock products
   */
  getLowStock: asyncHandler(async (req, res) => {
    const { storeId } = req.query;
    const result = await inventoryService.getLowStockProducts(storeId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Low stock products fetched successfully"));
  }),
};

module.exports = inventoryController;
