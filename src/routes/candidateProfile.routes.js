import express from "express";
import CandidateProfileController from "../controllers/candidateProfile.controller.js";

const router = express.Router();

const candidateProfileController = new CandidateProfileController();

router.post("/", candidateProfileController.createProfile);

router.get("/:userId", candidateProfileController.getProfile);

router.put("/:userId", candidateProfileController.updateProfile);
router.patch("/:userId", candidateProfileController.updateProfile);

router.delete("/:userId", candidateProfileController.deleteProfile);

router.post("/:userId/skills", candidateProfileController.addSkills);

router.delete(
  "/:userId/skills/:skillId",
  candidateProfileController.removeSkill
);

router.post("/:userId/resume", candidateProfileController.uploadResume);

router.delete("/:userId/resume", candidateProfileController.deleteResume);

router.patch(
  "/:userId/availability",
  candidateProfileController.updateAvailability
);



export default router;

