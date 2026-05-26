import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createStudentsProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters",
  }),

  rollNo: Joi.number().required().messages({
    "any.required": "Roll number is required",
    "number.base": "Roll number must be a number",
  }),

  email: Joi.string().trim().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Invalid email format",
  }),

  semester: Joi.string().trim().required().messages({
    "any.required": "Semester is required",
  }),

  course: Joi.string().trim().required().messages({
    "any.required": "Course is required",
  }),
});

const updateStudentsProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  rollNo: Joi.number().optional().messages({
    "number.base": "Roll number must be a number",
  }),

  email: Joi.string().trim().email().optional().messages({
    "string.email": "Invalid email format",
  }),

  semester: Joi.string().trim().optional(),

  course: Joi.string().trim().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update",
  });

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const message = error.details
      .map((d) => d.message)
      .join(", ");

    return next(new AppError(message, 400));
  }

  next();
};

export const createStudentsProfileValidator =
  validate(createStudentsProfileSchema);

export const updateStudentsProfileValidator =
  validate(updateStudentsProfileSchema);