import Joi from "joi";
import { AppError } from "../../utils/errors.js";           

const createInterviewSchema = Joi.object({
    interviewerEmail : Joi.string().email().required().messages({
  'string.email': 'Email must be a valid email address',
  'any.required': 'Email is required'
}),
    meetingLink: Joi.string().uri({
  scheme: ['http', 'https']
}).required().messages({
  'string.uri': 'Meeting link must be a valid URL',
  'any.required': 'Meeting link is required'
}),
timing: Joi.date().iso().required(),
})

const updateInterviewSchema = Joi.object({
    status: Joi.string()
    .valid("Scheduled", "Rescheduled", "Cancelled")
    .default("Scheduled")

})

const rescheduleInterviewSchema = Joi.object({
    interviewerEmail: Joi.string().email().required(),
    meetingLink: Joi.string().uri().required(),
    timing: Joi.date().iso().required(),
})

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true
  });

  if (error) {
    return next(
      new AppError(
        error.details.map(d => d.message).join(", "),
        400
      )
    );
  }

  next();
};


export const createInterviewValidator = validate(createInterviewSchema);
export const updateInterviewValidator = validate(updateInterviewSchema);
export const rescheduleInterviewValidator = validate(rescheduleInterviewSchema);