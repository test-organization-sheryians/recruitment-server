

import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().min(5).required().messages({
    "string.min": "Description must be at least 5 characters long",
    "any.required": "Description is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  stock: Joi.number().min(0).optional().messages({
    "number.min": "Stock cannot be negative",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),

  description: Joi.string().min(5).optional(),

  price: Joi.number().min(0).optional(),

  stock: Joi.number().min(0).optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  next();
};

export const createProductValidator = validate(createProductSchema);

export const updateProductValidator = validate(updateProductSchema);