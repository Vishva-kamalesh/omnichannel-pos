const User = require("../users/user.model");
const ApiError = require("../../utils/ApiError");
const generateToken = require("../../utils/generateToken");

/**
 * @description Register a new user
 * @param {Object} userData 
 * @returns {Object} - User object and token
 */
const register = async (userData) => {
  const { email } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Create user
  const user = await User.create(userData);

  // Generate token
  const token = generateToken(user._id);

  // Remove password from returned object
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * @description Authenticate user and get token
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} - User object and token
 */
const login = async (email, password) => {
  // Check for user (explicitly select password as it is hidden by default in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is deactivated. Please contact admin.");
  }

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * @description Get user by ID
 * @param {string} id 
 * @returns {Object} - User object
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

module.exports = {
  register,
  login,
  getUserById,
};
