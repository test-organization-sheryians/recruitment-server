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

const testEnrollmentsBulkSchema = joi.object({
  testId: objectId.required(),
  emails: joi.array()
    .items(joi.string().email().required())
    .min(1)
    .required()

})

const testAttemptSchema = joi.object({
  testId: objectId.required(),

  email: joi.string().email().required(),

  score: joi.number().min(0).required(),

  percentage: joi.number().min(0).max(100),

  isPassed: joi.boolean().default(false),

  status: joi
    .string()
    .valid("Started", "Submitted", "Graded", "Failed", "Disqualified")
    .default("Submitted"),

  tabSwitches: joi.number().min(0).default(0), 

  startTime: joi.date().required(),

  endTime: joi.date().optional(),

  durationTaken: joi.number().optional(),

  questions: joi.array().items(joi.any()).required(),
  answers: joi.array().items(joi.any()).required(),
});

export { testSchema, testAttemptSchema, testEnrollmentsSchema  , testEnrollmentsBulkSchema };
