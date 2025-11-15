import Joi from "joi";

// CREATE Experience Schema
export const experienceCreateSchema = Joi.object({
            candidateId: Joi.string()
                        .required()
                        .pattern(/^[0-9a-fA-F]{24}$/)
                        .messages({
                                    "string.pattern.base": "candidateId must be a valid MongoDB ObjectId"
                        }),

            company: Joi.string().trim().required(),
            title: Joi.string().trim().required(),
            location: Joi.string().trim().optional(),
            description: Joi.string().trim().optional(),

            startDate: Joi.date().required(),

            isCurrent: Joi.boolean().required(),

            endDate: Joi.alternatives().conditional("isCurrent", {
                        is: true,
                        then: Joi.valid(null).allow(null).optional(),
                        otherwise: Joi.date().required()
            }).custom((value, helpers) => {
                        if (value.endDate && value.startDate) {
                                    if (new Date(value.endDate) < new Date(value.startDate)) {
                                                return helpers.error("any.invalid", "endDate cannot be before startDate");
                                    }
                        }
                        return value;
            })
});




export const experienceUpdateSchema = Joi.object({
            candidateId: Joi.string()
                        .pattern(/^[0-9a-fA-F]{24}$/)
                        .messages({
                                    "string.pattern.base": "candidateId must be a valid MongoDB ObjectId"
                        })
                        .optional(),

            company: Joi.string().trim().optional(),
            title: Joi.string().trim().optional(),
            location: Joi.string().trim().optional(),
            description: Joi.string().trim().optional(),

            startDate: Joi.date().optional(),

            isCurrent: Joi.boolean().optional(),

            endDate: Joi.alternatives().conditional("isCurrent", {
                        is: true,
                        then: Joi.valid(null).allow(null).optional(),
                        otherwise: Joi.date().optional()
            }).custom((value, helpers) => {
                        if (value.endDate && value.startDate) {
                                    if (new Date(value.endDate) < new Date(value.startDate)) {
                                                return helpers.error("any.invalid", "endDate cannot be before startDate");
                                    }
                        }
                        return value;
            })
});