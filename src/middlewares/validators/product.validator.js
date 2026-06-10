import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Product name cannot be empty",
      "string.min": "Name must be at least 3 characters long",
      "any.required": "Product name is required",
    }),

  description: Joi.string()
    .min(10)
    .max(200)
    .required(),

  price: Joi.number()
    .positive()
    .required(),

  seller: Joi.string()
    .required(),

  stock: Joi.number()
    .min(0)
    .default(0),

  rating: Joi.number()
    .min(0)
    .max(5),
});

const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      "string.min": "Name must be at least 3 characters long",
    }),

  description: Joi.string()
    .min(10)
    .max(200)
    .optional(),

  price: Joi.number()
    .positive()
    .optional(),

  seller: Joi.string()
    .optional(),

  stock: Joi.number()
    .min(0)
    .optional(),

  rating: Joi.number()
    .min(0)
    .max(5)
    .optional(),
}).min(1);

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

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