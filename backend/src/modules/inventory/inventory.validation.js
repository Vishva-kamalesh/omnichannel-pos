const Joi = require("joi");

const inventoryValidation = {
  updateStock: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    storeId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).required(),
    remarks: Joi.string().max(255).optional(),
  }),

  transferStock: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    fromStoreId: Joi.string().hex().length(24).required(),
    toStoreId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).required(),
    remarks: Joi.string().max(255).optional(),
  }),

  adjustStock: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    storeId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().required(), // Can be negative for manual reduction
    remarks: Joi.string().max(255).required(), // Remarks mandatory for adjustments
  }),

  getLowStock: Joi.object({
    storeId: Joi.string().hex().length(24).optional(),
  }),
};

module.exports = inventoryValidation;
