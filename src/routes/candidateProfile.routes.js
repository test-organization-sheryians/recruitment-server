import express from "express";
import CandidateProfileController from "../controllers/candidateProfile.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import {
  createProfileValidator,
  updateProfileValidator,
  addSkillsValidator,
  updateAvailabilityValidator,
  uploadResumeValidator,
} from "../middlewares/validators/candidateProfile.validator.js";

const router = express.Router();

const candidateProfileController = new CandidateProfileController();

router.post(
  "/",
  authenticateJWT,
  createProfileValidator,
  candidateProfileController.createProfile
);

router.get("/:userId", authenticateJWT, candidateProfileController.getProfile);

router.patch(
  "/:userId",
  authenticateJWT,
  updateProfileValidator,
  candidateProfileController.updateProfile
);

router.delete(
  "/:userId",
  authenticateJWT,
  candidateProfileController.deleteProfile
);

router.post(
  "/:userId/skills",
  authenticateJWT,
  addSkillsValidator,
  candidateProfileController.addSkills
);

router.delete(
  "/:userId/skills/:skillId",
  authenticateJWT,
  candidateProfileController.removeSkill
);

router.post(
  "/:userId/resume",
  authenticateJWT,
  uploadResumeValidator,
  candidateProfileController.uploadResume
);

router.delete(
  "/:userId/resume",
  authenticateJWT,
  candidateProfileController.deleteResume
);

router.patch(
  "/:userId/availability",
  authenticateJWT,
  updateAvailabilityValidator,
  candidateProfileController.updateAvailability
);

export default router;
