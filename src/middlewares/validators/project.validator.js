import Joi from "joi";

// CREATE Project Schema
export const projectCreateValidator = Joi.object({
    candidateId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base":
                "candidateId must be a valid MongoDB ObjectId",
            "any.required":
                "candidateId is required",
        }),
    title: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
    githubUrl: Joi.string().uri().optional(),
    liveUrl: Joi.string().uri().optional(),
    technologies: Joi.array()
        .items(Joi.string().trim())
        .optional(),
});

// UPDATE Project Schema
export const projectUpdateValidator = Joi.object({
    candidateId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.pattern.base":
                "candidateId must be a valid MongoDB ObjectId",
        })
        .optional(),

    title: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    githubUrl: Joi.string().uri().optional(),
    liveUrl: Joi.string().uri().optional(),
    technologies: Joi.array()
        .items(Joi.string().trim())
        .optional(),
});