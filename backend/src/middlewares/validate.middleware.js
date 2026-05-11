const ApiError = require("../utils/ApiError");

/**
 * @description Middleware to validate request data against a Joi schema
 * @param {Object} schema - Joi schema
 * @returns {Function} - Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new ApiError(400, errorMessage));
  }

  req.body = value;
  next();
};

module.exports = validate;
