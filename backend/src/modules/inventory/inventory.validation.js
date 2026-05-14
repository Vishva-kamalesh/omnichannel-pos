const Joi = require("joi");

// Helper for MongoDB ObjectId validation
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("{{#label}} must be a valid MongoDB ObjectId");
  }
  return value;
};

const inventoryValidation = {
  updateStock: Joi.object({
    productId: Joi.string().custom(objectId).required().messages({
      "any.required": "Product ID is required",
    }),
    storeId: Joi.string().custom(objectId).required().messages({
      "any.required": "Store ID is required",
    }),
    quantity: Joi.number().min(1).required().messages({
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
    remarks: Joi.string().max(255).optional(),
  }),

  transferStock: Joi.object({
    productId: Joi.string().custom(objectId).required().messages({
      "any.required": "Product ID is required",
    }),
    fromStoreId: Joi.string().custom(objectId).required().messages({
      "any.required": "Source Store ID is required",
    }),
    toStoreId: Joi.string().custom(objectId).required().messages({
      "any.required": "Destination Store ID is required",
    }),
    quantity: Joi.number().min(1).required().messages({
      "number.min": "Transfer quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
    remarks: Joi.string().max(255).optional(),
  }),

  adjustStock: Joi.object({
    productId: Joi.string().custom(objectId).required(),
    storeId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().required(),
    remarks: Joi.string().max(255).required().messages({
      "any.required": "Remarks are required for stock adjustments",
    }),
  }),

  getLowStock: Joi.object({
    storeId: Joi.string().custom(objectId).optional(),
  }),
};

module.exports = inventoryValidation;
