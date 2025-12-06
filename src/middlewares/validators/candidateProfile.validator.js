import Joi from "joi";
import { AppError } from "../../utils/errors.js";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const createProfileSchema = Joi.object({
  experienceId: Joi.string().pattern(objectIdPattern).optional().messages({
    "string.pattern.base": "Experience ID must be a valid ObjectId",
  }),
  availability: Joi.string().valid("immediate", "1_week", "2_weeks", "1_month", "not_looking").optional().messages({
    "any.only": "Availability must be one of: immediate, 1_week, 2_weeks, 1_month, not_looking",
  }),
  linkedinUrl: Joi.string().uri().optional().allow('').messages({
    "string.uri": "LinkedIn URL must be a valid URL",
  }),
  githubUrl: Joi.string().uri().optional().allow('').messages({
    "string.uri": "GitHub URL must be a valid URL",
  }),
  portfolioUrl: Joi.string().uri().optional().allow('').messages({
    "string.uri": "Portfolio URL must be a valid URL",
  }),
  highestEducation: Joi.string().min(1).max(200).optional().messages({
    "string.min": "Highest education must be at least 1 character long",
    "string.max": "Highest education cannot exceed 200 characters",
  }),
  resumeFile: Joi.string().optional(),
  resumeScore: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Resume score must be at least 0",
    "number.max": "Resume score cannot exceed 100",
  }),
  skills: Joi.array().items(
    Joi.string().min(1).max(100).messages({
      "string.min": "Each skill name must be at least 1 character long",
      "string.max": "Each skill name cannot exceed 100 characters",
    })
  )
});

const updateProfileSchema = Joi.object({
  experienceId: Joi.string().pattern(objectIdPattern).optional().messages({
    "string.pattern.base": "Experience ID must be a valid ObjectId",
  }),
  availability: Joi.string().valid("immediate", "1_week", "2_weeks", "1_month", "not_looking").optional().messages({
    "any.only": "Availability must be one of: immediate, 1_week, 2_weeks, 1_month, not_looking",
  }),
  linkedinUrl: Joi.string().uri().optional().allow('').messages({
    "string.uri": "LinkedIn URL must be a valid URL",
  }),
  githubUrl: Joi.string().uri().optional().allow('').messages({
    "string.uri": "GitHub URL must be a valid URL",
  }),
  portfolioUrl: Joi.string().uri().optional().allow('').messages({
    "string.uri": "Portfolio URL must be a valid URL",
  }),
  highestEducation: Joi.string().min(1).max(200).optional().messages({
    "string.min": "Highest education must be at least 1 character long",
    "string.max": "Highest education cannot exceed 200 characters",
  }),
  resumeFile: Joi.string().optional(),
  resumeScore: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Resume score must be at least 0",
    "number.max": "Resume score cannot exceed 100",
  }),
  skills: Joi.array().items(
    Joi.string().min(1).max(100).messages({
      "string.min": "Each skill name must be at least 1 character long",
      "string.max": "Each skill name cannot exceed 100 characters",
    })
  ).min(1).messages({
    "array.min": "At least one skill is required",
    "any.required": "Skills are required",
  }),
});

const addSkillsSchema = Joi.object({
  skills: Joi.array().items(
    Joi.string().min(1).max(100).messages({
      "string.min": "Each skill name must be at least 1 character long",
      "string.max": "Each skill name cannot exceed 100 characters",
    })
  ).min(1).required().messages({
    "array.min": "At least one skill is required",
    "any.required": "Skills are required",
  }),
});

const updateAvailabilitySchema = Joi.object({
  availability: Joi.string().valid("immediate", "1_week", "2_weeks", "1_month", "not_looking").required().messages({
    "any.only": "Availability must be one of: immediate, 1_week, 2_weeks, 1_month, not_looking",
    "any.required": "Availability is required",
  }),
});

const uploadResumeSchema = Joi.object({
  resumeFile: Joi.string().required().messages({
    "any.required": "Resume file is required",
  }),
  resumeScore: Joi.number().min(0).max(100).required().messages({
    "number.min": "Resume score must be at least 0",
    "number.max": "Resume score cannot exceed 100",
    "any.required": "Resume score is required",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const createProfileValidator = validate(createProfileSchema);
export const updateProfileValidator = validate(updateProfileSchema);
export const addSkillsValidator = validate(addSkillsSchema);
export const updateAvailabilityValidator = validate(updateAvailabilitySchema);
export const uploadResumeValidator = validate(uploadResumeSchema);