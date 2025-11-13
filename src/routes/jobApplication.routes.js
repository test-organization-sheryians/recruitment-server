import express from "express";
import uploadResume from "../middlewares/uploadResume";
import { authorize } from "../middlewares/role.middleware";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router;

// Apply for a job
router.post(
  "/apply/:jobId",
  authenticateJWT,
  authorize,
  uploadResume.single("resume"),
  jobApplicationController.applyForJob
);

// Admin can see all aplications
router.get(
  "/",
  authenticateJWT,
  authorize("jobApplication", "view"),
  jobApplicationController.getAllApplications
);

export default router;
