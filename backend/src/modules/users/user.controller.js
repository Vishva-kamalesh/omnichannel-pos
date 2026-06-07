const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const userService = require("./user.service");

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User created successfully"));
});

const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, "Users fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.params.id, req.body.newPassword);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, user, "User deactivated successfully"));
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  deactivateUser,
};
