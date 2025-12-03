import express from "express";
import testAttemptsController from "../controllers/testAttempts.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { testAttemptSchema } from "../middlewares/validators/test.validator.js";
import { checkEnrollment } from "../middlewares/checkEnrollment.middleware.js";

const router = express.Router();

router.post(
  "/start",
  authenticateJWT,
  checkEnrollment,
  testAttemptsController.startTest
);

router.patch(
  "/submit/:attemptId",
  authenticateJWT,
  validateRequest(testAttemptSchema),
  testAttemptsController.submitTest
);

router.get(
  "/user/:testId",
  authenticateJWT,
  testAttemptsController.getUserAttempts
);

export default router;
