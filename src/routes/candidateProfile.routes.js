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

router.post("/", authenticateJWT, createProfileValidator, candidateProfileController.createProfile);

router.get("/:userId", authenticateJWT, candidateProfileController.getProfile);

<<<<<<< HEAD
router.put(
  "/:userId",
  authenticateJWT,
  candidateProfileController.updateProfile
);
router.patch(
  "/:userId",
  authenticateJWT,
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
  candidateProfileController.addSkills
);

router.delete(
=======
router.patch("/:userId", authenticateJWT, updateProfileValidator, candidateProfileController.updateProfile);

router.delete("/:userId", authenticateJWT, candidateProfileController.deleteProfile);

router.post("/:userId/skills", authenticateJWT, addSkillsValidator, candidateProfileController.addSkills);

router.delete(
>>>>>>> 670c2be5969f9360bf1a79f9c3f1fde9afdc8dca
  "/:userId/skills/:skillId",
  authenticateJWT,
  candidateProfileController.removeSkill
);

<<<<<<< HEAD
router.post(
  "/:userId/resume",
  authenticateJWT,
  candidateProfileController.uploadResume
);

router.delete(
  "/:userId/resume",
  authenticateJWT,
  candidateProfileController.deleteResume
);
=======
router.post("/:userId/resume", authenticateJWT, uploadResumeValidator, candidateProfileController.uploadResume);

router.delete("/:userId/resume", authenticateJWT, candidateProfileController.deleteResume);
>>>>>>> 670c2be5969f9360bf1a79f9c3f1fde9afdc8dca

router.patch(
  "/:userId/availability",
  authenticateJWT,
  updateAvailabilityValidator,
  candidateProfileController.updateAvailability
);

export default router;
