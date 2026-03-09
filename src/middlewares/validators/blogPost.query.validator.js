import Joi from "joi";

export const blogListQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10),

  skip: Joi.number().integer().min(0).default(0),

  category: Joi.string().optional(),
  search: Joi.string().optional(),

  isPublished: Joi.boolean().optional(),
  technology: Joi.string()
    .pattern(/^[a-f\d]{24}(,[a-f\d]{24})*$/i)  
    .optional()
}).unknown(false);

