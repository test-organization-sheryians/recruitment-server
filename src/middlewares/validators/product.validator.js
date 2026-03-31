import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const productSchema = Joi.object({
    title: Joi.string().required().trim().min(3).max(10).messages({
        "string.min": "Title must be at least 3 character long",
        "string.max": "Title must be at most 10 character long",
        "any.required": "Title is required"
    }),
    description: Joi.string().optional().trim().min(5).max(15),
    price: Joi.number().required().min(0).messages({
        "number.base": "Price must be a number",
        "any.required": "Price is required",
        "number.min": "Price cannot be negative"
    }),
    category: Joi.string().trim().required().messages({
        "any.required": "Category is required"
    })
});

const updateProductSchema = Joi.object({
    title: Joi.string().optional().trim().min(3).max(10).messages({
        "string.min": "Title must be at least 3 character long",
        "string.max": "Title must be at most 10 character long",
    }),
    description: Joi.string().optional().trim().min(5).max(15),
    price: Joi.number().optional().min(0).messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative"
    }),
    category: Joi.string().trim().optional()
}).min(1)

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(
            new AppError(error.details.map((d) => d.message).join(", "), 400)
        )
    }
    next()
};

export const productValidator = validate(productSchema);
export const updateProductValidator = validate(updateProductSchema)