import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.base": "Product name must be a string",
            "string.empty": "Product name is required",
            "string.min": "Product name must be at least 2 characters",
            "string.max": "Product name must be at most 100 characters",
            "any.required": "Product name is required",
        }),
    description: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .required()
        .messages({
            "string.base": "Product description must be a string",
            "string.empty": "Product description is required",
            "string.min": "Product description must be at least 10 characters",
            "string.max": "Product description must be at most 1000 characters",
            "any.required": "Product description is required",
        }),
    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Product price must be a number",
            "number.positive": "Product price must be greater than 0",
            "any.required": "Product price is required",
        }),
    category: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.base": "Product category must be a string",
            "string.empty": "Product category is required",
            "string.min": "Product category must be at least 2 characters",
            "string.max": "Product category must be at most 50 characters",
            "any.required": "Product category is required",
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Product stock must be a number",
            "number.integer": "Product stock must be an integer",
            "number.min": "Product stock cannot be negative",
            "any.required": "Product stock is required",
        }),
}).unknown(false);

const updateProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            "string.base": "Product name must be a string",
            "string.min": "Product name must be at least 2 characters",
            "string.max": "Product name must be at most 100 characters",
        }),
    description: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .messages({
            "string.base": "Product description must be a string",
            "string.min": "Product description must be at least 10 characters",
            "string.max": "Product description must be at most 1000 characters",
        }),
    price: Joi.number()
        .positive()
        .messages({
            "number.base": "Product price must be a number",
            "number.positive": "Product price must be greater than 0",
        }),
    category: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .messages({
            "string.base": "Product category must be a string",
            "string.min": "Product category must be at least 2 characters",
            "string.max": "Product category must be at most 50 characters",
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "Product stock must be a number",
            "number.integer": "Product stock must be an integer",
            "number.min": "Product stock cannot be negative",
        }),
}).min(1).unknown(false);

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map((d) => d.message).join(", ");
        return next(new AppError(message, 400));
    }
    next();
};

export const createProductValidator = validate(createProductSchema);
export const updateProductValidator = validate(updateProductSchema);