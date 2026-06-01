const Joi = require("joi");

const objectId = (value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.message("{{#label}} must be a valid MongoDB ObjectId");
  }
  return value;
};

const orderItemSchema = Joi.object({
  productId: Joi.string().custom(objectId).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const createOrderSchema = Joi.object({
  storeId: Joi.string().custom(objectId).required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  paymentMethod: Joi.string()
    .valid("cash", "card", "upi", "credit")
    .required(),
  tax: Joi.number().min(0).default(0),
  discount: Joi.number().min(0).default(0),
  customerId: Joi.string().custom(objectId).optional(),
  notes: Joi.string().max(500).allow("").optional(),
});

const refundOrderSchema = Joi.object({
  reason: Joi.string().max(500).required(),
});

module.exports = {
  createOrderSchema,
  refundOrderSchema,
};
