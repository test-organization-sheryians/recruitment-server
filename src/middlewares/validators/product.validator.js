import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  description: Joi.string().min(5).max(500).required().messages({
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
  }),
  price: Joi.number().positive().messages({
    "number.positive": "Price must be greater than 0",
  }),
  description: Joi.string().min(5).max(500).messages({
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 500 characters",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new AppError(
        error.details.map((d) => d.message).join(", "),
        400
      )
    );
  }

  next();
};

export const createProductValidator = validate(createProductSchema);
export const updateProductValidator = validate(updateProductSchema);