const Joi = require("joi");

const objectId = (value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.message("{{#label}} must be a valid MongoDB ObjectId");
  }
  return value;
};

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("admin", "manager", "cashier").default("cashier"),
  storeId: Joi.string().custom(objectId).optional(),
  isActive: Joi.boolean().default(true),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid("admin", "manager", "cashier"),
  storeId: Joi.string().custom(objectId),
  isActive: Joi.boolean(),
}).min(1);

const changePasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
};
