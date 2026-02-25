import Joi from "joi";
import mongoose from "mongoose";
import { AppError } from "../../utils/errors.js";

/**
 * Job Application Question Joi Schema
 */


const singleQuestionSchema = Joi.object({
  title: Joi.string().min(5).max(500).required().messages({
    "string.empty": "Question title is required",
    "string.min": "Question title must be at least 5 characters",
    "string.max": "Question title cannot exceed 500 characters",
  }),

  inputType: Joi.string()
    .valid(
      "text",
      "textarea",
      "radio",
      "checkbox",
      "dropdown",
      "yes-no",
      "file",
      "date",
      "number",
      "rating"
    )
    .required()
    .messages({
      "any.only": "Invalid input type",
      "any.required": "Input type is required",
    }),

  description: Joi.string().max(1000).allow("", null),

  options: Joi.when("inputType", {
    is: Joi.valid("radio", "checkbox", "dropdown"),
    then: Joi.array()
      .items(Joi.string().trim().min(1))
      .min(1)
      .required()
      .messages({
        "array.min":
          "Options are required for radio, checkbox, or dropdown questions",
      }),
    otherwise: Joi.array().items(Joi.string()).default([]),
  }),

  isRequired: Joi.boolean().default(false),

  isKnockout: Joi.boolean().default(false),

  knockoutValue: Joi.when("isKnockout", {
    is: true,
    then: Joi.string().required().messages({
      "any.required": "Knockout value is required when isKnockout is true",
    }),
    otherwise: Joi.string().allow(null),
  }),

  order: Joi.number().integer().min(0),

  placeholder: Joi.string().allow("", null),

  maxLength: Joi.number().integer().min(1),
});

const createApplicationQuestionsSchema = Joi.object({
  questions: Joi.array()
    .items(singleQuestionSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Questions must be an array",
      "array.min": "At least one question is required",
      "any.required": "Questions are required",
    }),
});

const updateQuestionDataSchema = Joi.object({
  title: Joi.string().min(5).max(500),
  inputType: Joi.string().valid(
    "text",
    "textarea",
    "radio",
    "checkbox",
    "dropdown",
    "yes-no",
    "file",
    "date",
    "number",
    "rating"
  ),

  description: Joi.string().max(1000).allow("", null),

  options: Joi.when("inputType", {
    is: Joi.valid("radio", "checkbox", "dropdown"),
    then: Joi.array()
      .items(Joi.string().trim().min(1))
      .min(1)
      .required()
      .messages({
        "array.min":
          "Options are required for radio, checkbox, or dropdown questions",
      }),
    otherwise: Joi.array().items(Joi.string()),
  }),

  isRequired: Joi.boolean(),

  isKnockout: Joi.boolean(),

  knockoutValue: Joi.when("isKnockout", {
    is: true,
    then: Joi.string().required().messages({
      "any.required": "Knockout value is required when isKnockout is true",
    }),
    otherwise: Joi.string().allow(null),
  }),

  order: Joi.number().integer().min(0),

  placeholder: Joi.string().allow("", null),

  maxLength: Joi.number().integer().min(1),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  });


const validate = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const createQuestionsValidator = validate(createApplicationQuestionsSchema);
export const updateQuestionValidator = validate(updateQuestionDataSchema);