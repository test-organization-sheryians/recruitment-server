import express from "express";
import ExperienceController from "../controllers/experience.controller.js";
import { experienceCreateValidator, experienceUpdateSchema } from "../middlewares/validators/experience.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";

const router = express.Router();
const expereniceController = new ExperienceController();


// create a new experience
router.post("/", validateRequest(experienceCreateValidator), expereniceController.createExperience)

// get all experience for a candidate
router.get("/:candidateId", expereniceController.getCandidateExperiences)


// get a single experience by ID
router.get("/single/:id", expereniceController.getSingleExperience)

// update experience
router.patch("/:id", validateRequest(experienceUpdateSchema), expereniceController.updateExperience)

// Delete experience
router.delete("/:id", expereniceController.deleteExperience)


export default router;