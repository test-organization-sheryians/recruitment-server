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

router.get("/get-profile", authenticateJWT, candidateProfileController.getProfile);

router.patch("/update-profile", authenticateJWT, updateProfileValidator, candidateProfileController.updateProfile);

router.delete("/delete-profile", authenticateJWT, candidateProfileController.deleteProfile);

router.post("/add-skills", authenticateJWT, addSkillsValidator, candidateProfileController.addSkills);

router.delete(
  "/remove-skill/:skillName",
  authenticateJWT,
  candidateProfileController.removeSkill
);

router.post("/upload-resume", authenticateJWT, uploadResumeValidator, candidateProfileController.uploadResume);
router.delete("/delete-resume", authenticateJWT, candidateProfileController.deleteResume);

router.patch(
  "/update-availability",
  authenticateJWT,
  updateAvailabilityValidator,
  candidateProfileController.updateAvailability
);

export default router;

