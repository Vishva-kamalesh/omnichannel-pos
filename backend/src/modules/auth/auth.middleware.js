const jwt = require("jsonwebtoken");
const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const User = require("../users/user.model");

/**
 * @description Protect routes by verifying JWT
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    throw new ApiError(401, "Not authorized to access this route");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(404, "No user found with this id");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account is deactivated");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized to access this route");
  }
});

module.exports = { protect };
