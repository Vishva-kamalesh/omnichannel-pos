const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../modules/users/user.model");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      // Use the same secret the token was signed with (utils/generateToken).
      // No "secret" fallback — a missing JWT_SECRET must fail loudly, not verify
      // against a different key than the one used to sign.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        throw new ApiError(401, "Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      throw new ApiError(401, "Not authorized, token failed");
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }
});

module.exports = { protect };
