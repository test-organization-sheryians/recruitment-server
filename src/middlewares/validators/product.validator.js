import Joi from "joi";


export const productCreateValidator = Joi.object({
	name: Joi.string().trim().required(),

	description: Joi.string().trim().optional(),

	price: Joi.number().required(),
});


export const productUpdateValidator = Joi.object({
	name: Joi.string().trim().optional(),

	description: Joi.string().trim().optional(),

	price: Joi.number().optional(),
});