import express from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import jobApplicationQuestionController from "../controllers/jobApplicatonQuestion.controller.js";
import { createQuestionsValidator, updateQuestionValidator } from "../middlewares/validators/jobApplicationQuestion.validator.js";

const router = express.Router();

router.post(
  "/createjobquestions/:id",
  authenticateJWT,
   authorize("admin"),
  createQuestionsValidator,
  jobApplicationQuestionController.createApplicationQuestion
);

router.get(
  "/getjobquestions/:id",
  authenticateJWT,
  // authorize("admin"),
  jobApplicationQuestionController.getApplicationQuestion
);

router.patch(
  "/updatejobquestion/:id",
  authenticateJWT,
  authorize("admin"),
  updateQuestionValidator,
  jobApplicationQuestionController.updateApplicationQuestion
);
 
router.delete("/deletejobquestion/:id",authenticateJWT,authorize("admin"),jobApplicationQuestionController.deleteApplicationQuestion)


export default router;
