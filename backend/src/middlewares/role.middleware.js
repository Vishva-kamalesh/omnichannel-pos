const ApiError = require("../utils/ApiError");

/**
 * @description Middleware to restrict access based on user roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `User role ${req.user ? req.user.role : "unknown"} is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = { authorize };
