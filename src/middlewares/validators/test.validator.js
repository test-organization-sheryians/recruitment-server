import joi from "joi";

const objectId = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const testSchema = joi.object({
    title: joi.string().required(),
    summury: joi.string().allow(""),
    showResults: joi.boolean().default(false),
    createdBy: objectId.required(),
    category: joi.string().required(),
    status: joi.boolean().default(true),
    duration: joi.number().required(),
    passingScore: joi.number().required(),
    prompt: joi.string().required(),
});

const testEnrollmentsSchema = joi.object({
    testId: objectId.required(),

    email: joi.string().email().required(),

    status: joi.string()
        .valid("Assigned", "Started", "Completed")
        .default("Assigned"),
});

const testAttemptSchema = joi.object({
    testId: objectId.required(),

    email: objectId.required(),

    score: joi.number().min(0).required(),

    percentage: joi.number().min(0).max(100),

    isPassed: joi.boolean().default(false),

    status: joi.string()
        .valid("Started", "Submitted", "Graded", "Failed")
        .default("Submitted"),

    startTime: joi.date().required(),

    endTime: joi.date().optional(),

    durationTaken: joi.number().optional(),

    answers: joi.array().items(joi.any()).required(),
});

export{
    testSchema,
    testAttemptSchema,
    testEnrollmentsSchema
}