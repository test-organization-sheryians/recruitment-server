import Joi from 'joi';
import { AppError } from '../../utils/errors.js';

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Product name is required',
    'string.empty': 'Product name is required',
  }),
  price: Joi.number().required().messages({
    'any.required': 'Product price is required',
    'number.base': 'Price must be a number',
  }),
  stock: Joi.number().integer().min(0).optional().default(0).messages({
    'number.min': 'Stock must be a non-negative integer',
    'number.integer': 'Stock must be a non-negative integer',
    'number.base': 'Stock must be a non-negative integer',
  }),
  description: Joi.string().optional().allow(''),
  category: Joi.string().optional().allow('')
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const validateProduct = validate(productSchema);
