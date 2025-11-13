import express from "express";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import jobApplicationController from "../controllers/jobApplication.controller.js";

const router = express.Router();

// Apply for a job
<<<<<<< HEAD
router.post("/:jobId", authenticateJWT, applyForJob);
=======
router.post(
  "/:jobId",
  authenticateJWT,
  authorize("jobApplication", "create"),
  jobApplicationController.applyForJob
);
>>>>>>> b2141d8 (feat:implement the all routes and controller)

router.get(
  "/",
  authenticateJWT,
  authorize("jobApplication", "view"),
  jobApplicationController.getAllApplications
);

router.patch(
  "/:applicationId/status",
  authenticateJWT,
  authorize("jobApplication", "update"),
  jobApplicationController.updateApplicationStatus
);

router.get(
  "/filter/:status",
  authenticateJWT,
  authorize("jobApplication", "view"),
  jobApplicationController.filterApplications
);

export default router;
