const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const orderService = require("./order.service");

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user);
  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getOrders(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const refundOrder = asyncHandler(async (req, res) => {
  const order = await orderService.refundOrder(
    req.params.id,
    req.body.reason,
    req.user
  );
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order refunded successfully"));
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  refundOrder,
};
