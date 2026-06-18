import Joi from "joi";
import { AppError } from "../../utils/errors.js";

// ✅ CREATE PRODUCT
const createProductSchema = Joi.object({
  title: Joi.string().trim().min(3).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
  }),

  description: Joi.string().allow("", null),

  image: Joi.string().uri().required().messages({
    "string.uri": "Image must be a valid URL",
    "any.required": "Image is required",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
});

// ✅ UPDATE PRODUCT (PATCH)
const updateProductSchema = Joi.object({
  title: Joi.string().trim().min(3),

  description: Joi.string().allow("", null),

  image: Joi.string().uri(),

  price: Joi.number().positive(),
});

// ✅ COMMON VALIDATE FUNCTION (same as yours)
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  next();
};

// ✅ EXPORTS
export const createProductValidator = validate(createProductSchema);
export const updateProductValidator = validate(updateProductSchema);