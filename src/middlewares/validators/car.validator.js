import Joi from "joi";
import { AppError } from "../../utils/errors.js";


/**
 * CREATE CAR SCHEMA
 */

export const createCarSchema = Joi.object({
    title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),

  brand: Joi.string().required().messages({
    "string.empty": "Brand is required",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
  }),

  year: Joi.number().integer().min(1980).required().messages({
    "number.base": "Year must be a number",
    "number.min": "Year must be valid",
  }),

  fuelType: Joi.string()
    .valid("petrol", "diesel", "electric", "cng")
    .required()
    .messages({
      "any.only": "Fuel type must be petrol, diesel, electric, or cng",
    }),


    transmission: Joi.string()
    .valid("manual", "automatic")
    .required()
    .messages({
      "any.only": "Transmission must be manual or automatic",
    }),

    kmDriven: Joi.number().min(0).required().messages({
    "number.base": "KM Driven must be a number",
  }),
})

/**
 * UPDATE CAR SCHEMA
 * (at least one field required)
 */
export const updateCarSchema = Joi.object({
  title: Joi.string(),
  brand: Joi.string(),
  price: Joi.number().positive(),
  year: Joi.number().integer().min(1980),
  fuelType: Joi.string().valid("petrol", "diesel", "electric", "cng"),
  transmission: Joi.string().valid("manual", "automatic"),
  kmDriven: Joi.number().min(0),
}).min(1);


/**
 * COMMON VALIDATOR FUNCTION
 */
const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new AppError(
        error.details.map((d) => d.message).join(", "),
        400
      )
    );
  }

  req.body = value; // cleaned data
  next();
};

export const createCarValidator = validate(createCarSchema);
export const updateCarValidator = validate(updateCarSchema);