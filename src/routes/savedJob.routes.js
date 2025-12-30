import express from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import SavedJobController from "../controllers/savedJob.controller.js";

const router = express.Router();

// Save a job
router.post(
  "/:jobId",
  authenticateJWT,
  SavedJobController.saveJob
);

// Get all saved jobs for logged user
router.get(
  "/",
  authenticateJWT,
  SavedJobController.getSavedJobs
);

// Remove saved job
router.delete(
  "/:jobId",
  authenticateJWT,
  SavedJobController.removeSavedJob
);

export default router;
