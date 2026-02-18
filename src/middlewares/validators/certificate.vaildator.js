import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const certificateTypes = ["Completion", "Internship", "Offer", "Other"];
const htmlUrlRegex = /^https?:\/\/.+\.html(\?.*)?$/i;

const createCertificateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required().messages({
    "string.base": "Certificate name must be a string",
    "string.empty": "Certificate name is required",
    "string.min": "Certificate name must be at least 2 characters",
    "string.max": "Certificate name must be at most 120 characters",
    "any.required": "Certificate name is required",
  }),

  type: Joi.string()
    .valid(...certificateTypes)
    .optional()
    .messages({
      "string.base": "Certificate type must be a string",
      "any.only":
        "Certificate type must be one of Completion, Internship, Offer, or Other",
    }),

  fileUrl: Joi.string().trim().pattern(htmlUrlRegex).required().messages({
    "string.base": "Certificate file URL must be a string",
    "string.empty": "Certificate file URL is required",
    "string.pattern.base": "File URL must be a valid .html link",
    "any.required": "Certificate file URL is required",
  }),
});

const updateCertificateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional().messages({
    "string.base": "Certificate name must be a string",
    "string.empty": "Certificate name cannot be empty",
    "string.min": "Certificate name must be at least 2 characters",
    "string.max": "Certificate name must be at most 120 characters",
  }),

  type: Joi.string()
    .valid(...certificateTypes)
    .optional()
    .messages({
      "string.base": "Certificate type must be a string",
      "any.only":
        "Certificate type must be one of Completion, Internship, Offer, or Other",
    }),

  fileUrl: Joi.string().trim().pattern(htmlUrlRegex).optional().messages({
    "string.base": "Certificate file URL must be a string",
    "string.pattern.base": "File URL must be a valid .html link",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return next(new AppError(message, 400));
  }

  next();
};

export const createCertificateValidator = validate(createCertificateSchema);
export const updateCertificateValidator = validate(updateCertificateSchema);
