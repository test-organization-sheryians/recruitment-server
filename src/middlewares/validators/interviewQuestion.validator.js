import Joi from "joi";

const createQuestionSchema = Joi.object({
  question: Joi.string().trim().min(5).required(),

  category: Joi.string().trim().required(),

  difficulty: Joi.string()
    .valid("Easy", "Medium", "Hard")
    .required(),
});

const updateQuestionSchema = Joi.object({
  question: Joi.string().trim().min(5).required(),

  category: Joi.string().trim().required(),

  difficulty: Joi.string()
    .valid("Easy", "Medium", "Hard")
    .required(),
});

export {
  createQuestionSchema,
  updateQuestionSchema,
};