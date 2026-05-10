const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");
const { registerSchema, loginSchema } = require("./auth.validation");
const ApiError = require("../../utils/ApiError");

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const result = await authService.register(value);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = value;
  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by auth middleware
  const user = await authService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    message: "User data retrieved successfully",
    data: { user },
  });
});

module.exports = {
  register,
  login,
  getMe,
};
