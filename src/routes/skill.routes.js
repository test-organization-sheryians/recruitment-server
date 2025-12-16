import express from "express";
import skillController from "../controllers/skill.controller.js";
import { createSkillSchema, updateSkillSchema } from "../middlewares/validators/skill.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, authorize("admin"), validateRequest(createSkillSchema), skillController.createSkill);

router.get("/", authenticateJWT,  skillController.getAllSkills);

router.get("/:id", authenticateJWT, authorize("admin"), skillController.getSkill);

router.put("/:id", authenticateJWT, authorize("admin"), validateRequest(updateSkillSchema), skillController.updateSkill);

router.delete("/:id", authenticateJWT, authorize("admin"), skillController.deleteSkill);

export default router;
