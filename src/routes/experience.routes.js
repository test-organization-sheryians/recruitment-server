import express from "express";
// import ExperienceController from "../controllers/experience.controller";
import ExperienceController from "../controllers/experience.controller.js";

const router = express.Router();
const expereniceController = new ExperienceController();

// create a new experience
router.post("/", expereniceController.createExperience)

// get all experience for a candidate
router.get("/:candidateId", expereniceController.getCandidateExperiences)

// get a single experience by ID

router.get("/single/:id", expereniceController.getSingleExperience)

// update experience
router.patch("/:id", expereniceController.updateExperience)

// Delete experience
router.delete("/:id", expereniceController.deleteExperience)


export default router;