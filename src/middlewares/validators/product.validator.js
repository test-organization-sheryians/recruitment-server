import Joi from "joi";
import { AppError } from "../../utils/errors.js";

// ✅ CREATE PRODUCT VALIDATOR
const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "any.required": "Name is required",
  }),

  description: Joi.string().allow("", null),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
});

// ✅ UPDATE PRODUCT VALIDATOR (PATCH)
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3),
  description: Joi.string().allow("", null),
  price: Joi.number().positive(),
}).min(1); // Ensures at least one field is provided for an update

// ✅ VALIDATE MIDDLEWARE
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  next();
};

export const createProductValidator = validate(createProductSchema);
export const updateProductValidator = validate(updateProductSchema);