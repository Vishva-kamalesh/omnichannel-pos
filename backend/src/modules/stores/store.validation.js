const Joi = require("joi");

const createStoreSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  location: Joi.string().min(2).max(120).required(),
  address: Joi.string().max(255).allow(""),
  contactNumber: Joi.string().max(20).allow(""),
  email: Joi.string().email().allow(""),
  isActive: Joi.boolean().default(true),
});

const updateStoreSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  location: Joi.string().min(2).max(120),
  address: Joi.string().max(255).allow(""),
  contactNumber: Joi.string().max(20).allow(""),
  email: Joi.string().email().allow(""),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createStoreSchema,
  updateStoreSchema,
};
