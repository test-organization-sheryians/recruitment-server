import express from "express";
import ExperienceController from "../controllers/experience.controller.js";
import { experienceCreateValidator, experienceUpdateValidator } from "../middlewares/validators/experience.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const expereniceController = new ExperienceController();


router.use(authenticateJWT);

// create a new experience
router.post("/", validateRequest(experienceCreateValidator), expereniceController.createExperience);

// get all experiences for a candidate
router.get("/candidate/:candidateId", expereniceController.getCandidateExperiences);

// get a single experience by ID
router.get("/:id", expereniceController.getSingleExperience);

// update experience
router.patch("/:id", validateRequest(experienceUpdateValidator), expereniceController.updateExperience);

// delete experience
router.delete("/:id", expereniceController.deleteExperience);



export default router;