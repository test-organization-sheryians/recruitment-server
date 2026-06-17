import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(1000).optional(),
  price: Joi.number().min(0).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(1000).optional(),
  price: Joi.number().min(0).optional(),
});

export {
  createProductSchema,
  updateProductSchema,
};
