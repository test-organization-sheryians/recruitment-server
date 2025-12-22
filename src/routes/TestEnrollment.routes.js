import express from "express";
import enrollmentController from "../controllers/testEnrollment.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { testEnrollmentsSchema ,  testEnrollmentsBulkSchema} from "../middlewares/validators/test.validator.js";

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

router.post("/bulk-enroll" , authenticateJWT ,validateRequest(testEnrollmentsBulkSchema) ,enrollmentController.enrollUsersBulk)

export default router;
