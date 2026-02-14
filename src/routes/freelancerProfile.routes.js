import express from "express";
import FreelancerProfileController from "../controllers/freelancerProfile.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const freelancerProfileController = new FreelancerProfileController();

router.post("/", authenticateJWT, freelancerProfileController.createProfile);

router.get("/", authenticateJWT, freelancerProfileController.getProfile);

router.post(
  "/add-skills",
  authenticateJWT,
  freelancerProfileController.addSkills,
);

router.post(
  "/upload-resume",
  authenticateJWT,
  freelancerProfileController.uploadResume,
);

export default router;
