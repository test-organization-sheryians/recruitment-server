import Joi from "joi";

// We create a "Schema" - a blueprint of allowed data
 const createProductSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Product name cannot be empty',
        'string.min': 'Name must be at least 3 characters long'
    }),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(), // ensures price is > 0
    seller: Joi.string().required(),
    stock: Joi.number().integer().min(0).default(0),
    ratings: Joi.number().min(0).max(5)
});
// updateProductSchema - Sab kuch optional hai
const updateProductSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.min': 'Name must be at least 3 characters long'
    }),
    description: Joi.string().min(10).optional(),
    price: Joi.number().positive().optional(),
    seller: Joi.string().optional(),
    stock: Joi.number().integer().min(0).optional(),
    ratings: Joi.number().min(0).max(5).optional()
}).min(1); // .min(1) ka matlab hai ki body bilkul khali nahi honi chahiye, kam se kam 1 field update ke liye honi chahiye

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const createProductValidator = validate(createProductSchema);
export const updateProductValidator = validate(updateProductSchema);