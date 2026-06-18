import Joi from "joi";

export const getProductByIdValidator = Joi.object({
  id: Joi.string().length(24).required(),
});

export const getProductsQueryValidator = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
}).unknown(true);

export const createProductValidator = Joi.object({
  title: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 2 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().min(5).required().messages({
    "string.empty": "Description cannot be empty",
    "any.required": "Description is required",
  }),

  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),

  price: Joi.object({
    amount: Joi.number().min(0).required().messages({
      "number.base": "Price amount must be a number",
      "number.min": "Price cannot be negative",
      "any.required": "Price amount is required",
    }),

    currency: Joi.string()
      .valid("INR", "$") 
      .optional()
      .messages({
        "any.only": "Currency must be either INR or $",
      }),
  })
    .required()
    .messages({
      "any.required": "Price is required",
    }),
}).unknown(false);

export const updateProductValidator = Joi.object({
  title: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 2 characters",
  }),

  description: Joi.string().trim().min(5).optional().messages({
    "string.empty": "Description cannot be empty",
  }),

  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),

  price: Joi.object({
    amount: Joi.number().min(0).optional().messages({
      "number.base": "Price amount must be a number",
      "number.min": "Price cannot be negative",
    }),

    currency: Joi.string().valid("INR", "$").optional().messages({
      "any.only": "Currency must be either INR or $",
    }),
  }).optional(),
})
  .min(1)
  .unknown(false);
