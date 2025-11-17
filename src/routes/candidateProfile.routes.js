import express from "express";
import CandidateProfileController from "../controllers/candidateProfile.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

const candidateProfileController = new CandidateProfileController();

router.post("/", authenticateJWT, candidateProfileController.createProfile);

router.get("/", authenticateJWT, candidateProfileController.getProfile);

router.put("/", authenticateJWT, candidateProfileController.updateProfile);
router.patch("/", authenticateJWT, candidateProfileController.updateProfile);

router.delete("/", authenticateJWT, candidateProfileController.deleteProfile);

router.post("/skills", authenticateJWT, candidateProfileController.addSkills);

router.delete(
  "/skills/:skillId",
  authenticateJWT,
  candidateProfileController.removeSkill
);

router.post("/resume", authenticateJWT, candidateProfileController.uploadResume);

router.delete("/resume", authenticateJWT, candidateProfileController.deleteResume);

router.patch(
  "/availability",
  authenticateJWT,
  candidateProfileController.updateAvailability
);



export default router;

