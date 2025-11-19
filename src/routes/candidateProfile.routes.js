import express from "express";
import CandidateProfileController from "../controllers/candidateProfile.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

const candidateProfileController = new CandidateProfileController();

router.post("/", authenticateJWT, candidateProfileController.createProfile);

router.get("/:userId", authenticateJWT, candidateProfileController.getProfile);

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
  "/:userId/skills/:skillId",
  authenticateJWT,
  candidateProfileController.removeSkill
);

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

router.patch(
  "/:userId/availability",
  authenticateJWT,
  candidateProfileController.updateAvailability
);

export default router;
