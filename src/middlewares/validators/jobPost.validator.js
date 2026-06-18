import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const createJobPostSchema = Joi.object({
  jobtitle: Joi.string().required().messages({
    "any.required": "Job title is required",
  }),
  company: Joi.string().required().messages({
    "any.required": "Company is required",
  }),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
  }),
  salary: Joi.string().required().messages({
    "any.required": "Salary is required",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
  }),
  skill: Joi.string().required().messages({
    "any.required": "Skill is required",
  }),
  status: Joi.string().required().messages({
    "any.required": "Status is required",
  }),
  roleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Role ID must be a valid ObjectId",
  }),
  isActive: Joi.boolean(),
});

const updateJobPostSchema = Joi.object({
  jobtitle: Joi.string(),
  company: Joi.string(),
  location: Joi.string(),
  salary: Joi.string(),
  description: Joi.string(),
  skill: Joi.string(),
  status: Joi.string(),
  roleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Role ID must be a valid ObjectId",
  }),
  isActive: Joi.boolean(),
}).min(1);

const validate = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(new AppError(error.details.map((d) => d.message).join(", "), 400));
  }
  next();
};

export const createJobPostValidator = validate(createJobPostSchema);
export const updateJobPostValidator = validate(updateJobPostSchema);
