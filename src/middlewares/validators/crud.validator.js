import Joi from "joi";

class CrudValidator {

    static createSchema = Joi.object({
        title: Joi.string()
            .required()
            .min(3)
            .max(200)
            .trim()
            .messages({
                "string.empty": "Title is required",
                "string.min": "Title must be at least 3 characters",
                "string.max": "Title cannot exceed 200 characters",
            }),
        content: Joi.string()
            .optional()
            .max(5000)
            .trim()
            .messages({
                "string.max": "Content cannot exceed 5000 characters",
            }),
    });


    static updateSchema = Joi.object({
        title: Joi.string()
            .optional()
            .min(3)
            .max(200)
            .trim()
            .messages({
                "string.min": "Title must be at least 3 characters",
                "string.max": "Title cannot exceed 200 characters",
            }),
        content: Joi.string()
            .optional()
            .max(5000)
            .trim()
            .messages({
                "string.max": "Content cannot exceed 5000 characters",
            }),
    });


    static validateCreate(req, res, next) {
        const { error, value } = CrudValidator.createSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const messages = error.details.map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages,
            });
        }

        req.body = value;
        next();
    }


    static validateUpdate(req, res, next) {
        const { error, value } = CrudValidator.updateSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const messages = error.details.map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages,
            });
        }

        req.body = value;
        next();
    }


    static validateId(req, res, next) {
        const { id } = req.params;
        const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

        if (!mongoIdRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }

        next();
    }
}

export default CrudValidator;
