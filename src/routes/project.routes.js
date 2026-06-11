import express from "express";
import ProjectController from "../controllers/project.controller.js";
import {
    projectCreateValidator,
    projectUpdateValidator,
} from "../middlewares/validators/project.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const projectController = new ProjectController();

router.use(authenticateJWT);

// Create Project
router.post("/", validateRequest(projectCreateValidator), projectController.createProject);

// Get all projects of a candidate
router.get("/candidate/:candidateId", projectController.getCandidateProjects);

// Get single project
router.get("/:id", projectController.getSingleProject);

// Update project
router.patch("/:id", validateRequest(projectUpdateValidator), projectController.updateProject);

// Delete project
router.delete("/:id", projectController.deleteProject);

export default router;