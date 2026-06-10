import Joi from "joi";

// CREATE Product Schema
export const productCreateValidator = Joi.object({
	name: Joi.string().trim().required(),

	description: Joi.string().trim().optional(),

	price: Joi.string().trim().required(),
});

// UPDATE Product Schema
export const productUpdateValidator = Joi.object({
	name: Joi.string().trim().optional(),

	description: Joi.string().trim().optional(),

	price: Joi.string().trim().optional(),
});
