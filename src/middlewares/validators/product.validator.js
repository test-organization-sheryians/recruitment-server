import Joi from "joi";

 const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().default(0),
});

 const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  stock: Joi.number(),
});

export { createProductSchema, updateProductSchema };