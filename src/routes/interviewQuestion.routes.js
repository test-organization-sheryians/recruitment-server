import express from "express";
import interviewQuestionController from "../controllers/interviewQuestion.controller.js";

import validateRequest from "../middlewares/validators/validateRequest.js";

import {
  createQuestionSchema,
  updateQuestionSchema,
} from "../middlewares/validators/interviewQuestion.validator.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createQuestionSchema),
  interviewQuestionController.createQuestion
);

router.get(
  "/",
  interviewQuestionController.getAllQuestions
);

router.get(
  "/:id",
  interviewQuestionController.getQuestionById
);

router.put(
  "/:id",
  validateRequest(updateQuestionSchema),
  interviewQuestionController.updateQuestion
);

router.delete(
  "/:id",
  interviewQuestionController.deleteQuestion
);

export default router;