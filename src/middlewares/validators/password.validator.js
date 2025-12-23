import Joi from "joi";
import { AppError } from "../../utils/errors.js";

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),

  newPassword: Joi.string()
    .min(4)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required(),
});

const validate = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(
        error.details.map((d) => d.message).join(", "),
        400
      )
    );
  }
  next();
};

export const forgotPasswordValidator = validate(forgotPasswordSchema);
export const resetPasswordValidator = validate(resetPasswordSchema);
