import joi from "joi";

const objectId = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const testSchema = joi.object({
  title: joi.string().trim().required(),
  summury: joi.string().trim().allow(""),
  showResults: joi.boolean().default(false),
  category: joi.string().trim().required(),
  status: joi.boolean().default(true),
  duration: joi.number().positive().required(),
  passingScore: joi.number().min(0).required(),
  prompt: joi.string().trim().required(),
});

const testEnrollmentsSchema = joi.object({
  testId: objectId.required(),
  email: joi.string().trim().email().required(),
  status: joi
    .string()
    .valid("Assigned", "Started", "Completed")
    .default("Assigned"),
});

const testAttemptSchema = joi.object({
  testId: objectId.required(),

  email: joi.string().trim().email().required(),

  score: joi.number().min(0).required(),

  percentage: joi.number().min(0).max(100).optional(),

  isPassed: joi.boolean().optional(),

  status: joi
    .string()
    .valid("Started", "Submitted", "Graded", "Failed")
    .default("Submitted"),

  startTime: joi.date().required(),

  endTime: joi.date().optional(),

  durationTaken: joi.number().min(0).optional(),

  answers: joi.array().items(joi.object().unknown(true)).required(),
});

export { testSchema, testAttemptSchema, testEnrollmentsSchema };
