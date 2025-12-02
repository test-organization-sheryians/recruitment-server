import Joi from "joi";

// CREATE Experience Schema
export const experienceCreateValidator = Joi.object({
            company: Joi.string().trim().required(),
            title: Joi.string().trim().required(),
            location: Joi.string().trim().optional(),
            description: Joi.string().trim().optional(),

            startDate: Joi.date().required(),
            endDate: Joi.date().when("isCurrent", {
                        is: true,
                        then: Joi.forbidden(),
                        otherwise: Joi.date().required()
            }),
            isCurrent: Joi.boolean().required(),
});

export const experienceUpdateValidator = Joi.object({
            candidateId: Joi.string()
                        .pattern(/^[0-9a-fA-F]{24}$/)
                        .messages({
                                    "string.pattern.base": "candidateId must be a valid MongoDB ObjectId",
                        })
                        .optional(),

            company: Joi.string().trim().optional(),
            title: Joi.string().trim().optional(),
            location: Joi.string().trim().optional(),
            description: Joi.string().trim().optional(),

            startDate: Joi.date().optional(),
            endDate: Joi.date().optional(),
            isCurrent: Joi.boolean().optional(),
});