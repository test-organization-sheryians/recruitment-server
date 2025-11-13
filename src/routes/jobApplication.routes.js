import express from "express";
// import uploadResume from "../middlewares/uploadResume.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { applyForJob } from "../controllers/jobApplication.controller.js";

const router = express.Router();

// Apply for a job
router.post("/:jobId", authenticateJWT, applyForJob);

// Admin can see a ll aplications
// router.get(
//   "/",
//   authenticateJWT,
//   authorize("jobApplication", "view"),
//   jobApplicationController.getAllApplications
// );

export default router;
