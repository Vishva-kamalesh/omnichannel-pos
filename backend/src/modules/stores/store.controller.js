const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const storeService = require("./store.service");

const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, store, "Store created successfully"));
});

const getStores = asyncHandler(async (req, res) => {
  const result = await storeService.getStores(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Stores fetched successfully"));
});

const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, store, "Store fetched successfully"));
});

const updateStore = asyncHandler(async (req, res) => {
  const store = await storeService.updateStore(req.params.id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, store, "Store updated successfully"));
});

const deactivateStore = asyncHandler(async (req, res) => {
  const store = await storeService.deactivateStore(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, store, "Store deactivated successfully"));
});

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deactivateStore,
};
