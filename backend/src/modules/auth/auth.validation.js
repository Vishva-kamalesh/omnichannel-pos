const Joi = require("joi");

/**
 * @description Validation schema for user registration
 */
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("admin", "manager", "cashier"),
  storeId: Joi.string().alphanum().length(24), // Assuming MongoDB ObjectId string
});

/**
 * @description Validation schema for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
