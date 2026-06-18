import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createCompanySchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Company name cannot be empty",
    "string.min": "Company name must be at least 3 characters long",
  }),

  description: Joi.string().min(10).required(),

  website: Joi.string().uri().required().messages({
    "string.uri": "Please enter a valid website URL",
  }),

  industry: Joi.string().required(),

  companySize: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
    .required(),

  location: Joi.string().required(),

  logo: Joi.string().optional().allow(""),

  isActive: Joi.boolean().optional(),
});

const updateCompanySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),

  description: Joi.string().min(10).optional(),

  website: Joi.string().uri().optional().messages({
    "string.uri": "Please enter a valid website URL",
  }),

  industry: Joi.string().optional(),

  companySize: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
    .optional(),

  location: Joi.string().optional(),

  logo: Joi.string().optional().allow(""),

  isActive: Joi.boolean().optional(),
}).min(1);

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  next();
};

export const createCompanyValidator = validate(createCompanySchema);
export const updateCompanyValidator = validate(updateCompanySchema);