import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

export { createProductSchema, updateProductSchema };
