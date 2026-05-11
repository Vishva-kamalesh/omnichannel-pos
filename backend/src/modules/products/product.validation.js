const Joi = require("joi");

/**
 * @description Validation schema for creating a product
 */
const createProductSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Product name is required",
  }),
  description: Joi.string().allow("").trim(),
  sku: Joi.string().required().trim().messages({
    "string.empty": "SKU is required",
  }),
  barcode: Joi.string().allow("").trim(),
  category: Joi.string().required().trim().messages({
    "string.empty": "Category is required",
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  costPrice: Joi.number().required().min(0).messages({
    "number.base": "Cost price must be a number",
    "number.min": "Cost price cannot be negative",
  }),
  stock: Joi.number().min(0).default(0),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      publicId: Joi.string(),
    })
  ),
  variants: Joi.array().items(Joi.object().unknown(true)),
  storeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid Store ID",
  }),
  isActive: Joi.boolean().default(true),
});

/**
 * @description Validation schema for updating a product
 */
const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().allow("").trim(),
  sku: Joi.string().trim(),
  barcode: Joi.string().allow("").trim(),
  category: Joi.string().trim(),
  price: Joi.number().min(0),
  costPrice: Joi.number().min(0),
  stock: Joi.number().min(0),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string(),
      publicId: Joi.string(),
    })
  ),
  variants: Joi.array().items(Joi.object().unknown(true)),
  isActive: Joi.boolean(),
}).min(1); // At least one field must be provided for update

module.exports = {
  createProductSchema,
  updateProductSchema,
};
