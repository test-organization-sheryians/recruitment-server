import Joi from "joi";
import { AppError } from "../../utils/errors.js";  

// Helper function to validate MongoDB ObjectIds
const validateObjectId = Joi.string().length(24).hex().required().messages({
    'string.length': '{{#label}} must be a valid 24-character hexadecimal ObjectId.',
    'string.hex': '{{#label}} must only contain hexadecimal characters.',
    'any.required': '{{#label}} is required.'
});

// Define the valid status values from your Mongoose schema
const validStatuses = [
    "applied",
    "shortlisted",
    "rejected",
    "forwarded", // Corrected typo from 'forwareded' in your schema
    "interview",
    "hired",
];

// ----------------------------------------------------------------------
// 1. Validator for POST / (applyForJob)
// The candidateId is omitted because it is derived from req.userId, not the request body.
// ----------------------------------------------------------------------
export const applyForJobSchema = Joi.object({
    jobId: validateObjectId.label('Job ID'),
    
    // Resume URL is optional
    resumeUrl: Joi.string()
        .uri() // Ensures it's a valid URL format
        .trim()
        .max(255)
        .allow(null, '') // Allow null or empty string if it's optional
        .messages({
            'string.uri': 'Resume URL must be a valid web address.',
            'string.max': 'Resume URL must not exceed 255 characters.'
        }),

    // Optional message from the candidate
    message: Joi.string()
        .trim()
        .max(500)
        .allow(null, '') // Allow null or empty string
        .messages({
            'string.max': 'Message must not exceed 500 characters.'
        }),
});

// ----------------------------------------------------------------------
// 2. Validator for PATCH /:status (updateApplicationStatus)
// This validates the data sent in the request body when updating status.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// 2. Validator for PATCH /:id - Validates Request Body (Status Update)
// ----------------------------------------------------------------------
export const updateApplicationStatusSchema = Joi.object({
    // NEW: Application ID is now expected in the request body
    applicationId: validateObjectId.label('Application ID'), 

    status: Joi.string()
        .valid(...validStatuses) // Must be one of the defined enum values
        .required()
        .messages({
            'any.only': `Status must be one of: ${validStatuses.join(', ')}.`,
            'any.required': 'Status field is required for updating the application.'
        }),
    
    // Optionally allow a note/reason for the status change
    note: Joi.string()
        .trim()
        .max(500)
        .allow(null, '')
});


// ----------------------------------------------------------------------
// 3. Validator for ObjectId in URL params (e.g., job application ID in future routes)
// --------------------------------------
// 



const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return next(new AppError(message, 400));
  }
  next();
};

export const createJobValidator = validate(applyForJobSchema);
export const updateJobStatus = validate(updateApplicationStatusSchema);
