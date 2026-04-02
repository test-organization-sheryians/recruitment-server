import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const locationSchema = Joi.object({
  city: Joi.string().min(2).max(100).required().messages({
    "string.min": "City must be at least 2 characters long",
    "string.max": "City cannot exceed 100 characters",
    "any.required": "City is required",
  }),

  state: Joi.string().min(2).max(100).required().messages({
    "string.min": "State must be at least 2 characters long",
    "string.max": "State cannot exceed 100 characters",
    "any.required": "State is required",
  }),

  country: Joi.string().min(2).max(100).required().messages({
    "string.min": "Country must be at least 2 characters long",
    "string.max": "Country cannot exceed 100 characters",
    "any.required": "Country is required",
  }),

  pincode: Joi.string()
    .pattern(/^[0-9]{4,10}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be a valid numeric code",
      "any.required": "Pincode is required",
    }),
});

const salarySchema = Joi.object({
  min: Joi.number().min(0).required().messages({
    "number.base": "Salary min must be a number",
    "number.min": "Salary min must be 0 or greater",
    "any.required": "Salary min is required",
  }),
  max: Joi.number().min(0).required().messages({
    "number.base": "Salary max must be a number",
    "number.min": "Salary max must be 0 or greater",
    "any.required": "Salary max is required",
  }),
  currency: Joi.string().valid("INR", "USD", "EUR", "GBP").required().messages({
    "any.only": "Currency must be INR, USD, EUR, or GBP",
    "any.required": "Currency is required",
  }),
});


const jobTypeSchema = Joi.string()
  .valid("Remote", "Hybrid", "Full-Time", "Part-Time")
  .messages({
    "any.only": "Job type must be Remote, Hybrid, Full-Time or Part-Time",
  });


const createJobRoleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),
  requiredExperience: Joi.number().min(0).required().messages({
    "number.base": "Required experience must be a number",
    "number.min": "Required experience cannot be negative",
    "any.required": "Required experience is required",
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Category must be a valid ObjectId",
    "any.required": "Category is required",
  }),
  education: Joi.string().min(3).max(100).required().messages({
    "string.min": "Education must be at least 3 characters long",
    "string.max": "Education cannot exceed 100 characters",
    "any.required": "Education is required",
  }),
  description: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  skills: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
      "string.pattern.base": "Each skill must be a valid ObjectId",
    })
  ).min(1).max(20).required().messages({
    "array.min": "At least one skill is required",
    "array.max": "Cannot have more than 20 skills",
    "any.required": "Skills are required",
  }),
  salary: Joi.object({
    min: Joi.number().positive().required(),
    max: Joi.number().positive().greater(Joi.ref("min")).required(),
    currency: Joi.string().default("INR")
  }).required(),

  jobType: Joi.string()
    .valid("Remote", "Full-Time", "Part-Time", "Hybrid")
    .required(),  
  expiry: Joi.date().greater('now').required().messages({
    "date.greater": "Expiry date must be in the future",
    "any.required": "Expiry date is required",
  }),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Client ID must be a valid ObjectId",
    "any.required": "Client ID is required",
  }),
  location: locationSchema.required(),
  
  // ✅ ADD
  jobType: jobTypeSchema.required(),
  salary: salarySchema.required(),
});

const partialLocationSchema = Joi.object({
  city: Joi.string().min(2).max(100),
  state: Joi.string().min(2).max(100),
  country: Joi.string().min(2).max(100),
  pincode: Joi.string().pattern(/^[0-9]{4,10}$/).messages({
    "string.pattern.base": "Pincode must be a valid numeric code",
  }),
}).min(1); // at least one field if location provided

const updateJobRoleSchema = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),
  requiredExperience: Joi.number()
  .min(0)
  .max(50)
  .messages({
    "number.base": "Required experience must be a number",
    "number.min": "Required experience must be at least 0",
    "number.max": "Required experience cannot exceed 50",
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Category must be a valid ObjectId",
  }),
  education: Joi.string().min(3).max(100).messages({
    "string.min": "Education must be at least 3 characters long",
    "string.max": "Education cannot exceed 100 characters",
  }),
  description: Joi.string().min(10).max(2000).messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  skills: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
      "string.pattern.base": "Each skill must be a valid ObjectId",
    })
  ).min(1).max(20).messages({
    "array.min": "At least one skill is required",
    "array.max": "Cannot have more than 20 skills",
  }),
  expiry: Joi.date().greater('now').messages({
    "date.greater": "Expiry date must be in the future",
  }),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Client ID must be a valid ObjectId",
  }),
  location: locationSchema.required(),

    // ✅ ADD
  jobType: jobTypeSchema,
  salary: salarySchema,
});


const filterJobRolesSchema = Joi.object({
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Client ID must be a valid ObjectId",
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Category must be a valid ObjectId",
  }),
  title: Joi.string().min(1).max(100).messages({
    "string.min": "Title filter must be at least 1 character long",
    "string.max": "Title filter cannot exceed 100 characters",
  }),
  expiry: Joi.string().valid('active', 'expired').messages({
    "any.only": "Expiry filter must be either 'active' or 'expired'",
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const createJobRoleValidator = validate(createJobRoleSchema);
export const updateJobRoleValidator = validate(updateJobRoleSchema);
export const filterJobRolesValidator = validateQuery(filterJobRolesSchema);
