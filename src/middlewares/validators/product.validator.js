import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().trim().min(5).max(1000).required(),

  price: Joi.number().min(0).required(),

  stock: Joi.number().integer().min(0).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().trim().min(5).max(1000).required(),

  price: Joi.number().min(0).required(),

  stock: Joi.number().integer().min(0).required(),
});

export {
  createProductSchema,
  updateProductSchema,
};