import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "any.required": "Title is required",
    "string.max": "Title must be at most 200 characters",
  }),
  content: Joi.string().trim().max(5000).allow("").optional(),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  content: Joi.string().trim().max(5000).allow("").optional(),
}).min(1).messages({
  "object.min": "At least one field is required to update",
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return next(new AppError(message, 400));
  }
  next();
};

export const createNoteValidator = validate(createNoteSchema);
export const updateNoteValidator = validate(updateNoteSchema);
