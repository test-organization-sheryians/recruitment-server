import express from "express";
//import * as jobValidator from "../middlewares/validators/jobApplication.validator.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import jobApplicationController from "../controllers/jobApplication.controller.js";
import { bulkUpdateJobStatus, createJobValidator, updateJobStatus } from "../middlewares/validators/jobApplication.validator.js";


const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  createJobValidator,
  jobApplicationController.applyForJob
);

router.get(
  "/",
  authenticateJWT,
  authorize("admin"),

  jobApplicationController.getAllApplications
);

router.patch(
  "/bulk-update",
  authenticateJWT,
  authorize("admin"),
  bulkUpdateJobStatus,
  jobApplicationController.bulkUpdateApplicationStatus
)

router.patch(
  "/:status",
  // "status",
  authenticateJWT,
  authorize("admin"),
  updateJobStatus,
  jobApplicationController.updateApplicationStatus
);

router.get(
  "/filter/:status",
  authenticateJWT,
  authorize("admin"),

  jobApplicationController.filterApplications
);


router.get("/applicants/:id", authenticateJWT, authorize("admin"), jobApplicationController.getApplicantsByJobId);


router.get("/my-applications", authenticateJWT, jobApplicationController.getCandidateAllApplications);

export default router;
