import express from "express";
import enrollmentController from "../controllers/testEnrollment.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { testEnrollmentsSchema } from "../middlewares/validators/test.validator.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  validateRequest(testEnrollmentsSchema),
  enrollmentController.enrollUser
);

router.get(
  "/user/:email",
  authenticateJWT,
  enrollmentController.getAssignedTests
);

export default router;
