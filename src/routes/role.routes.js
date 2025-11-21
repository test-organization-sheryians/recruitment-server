// src/routes/role.routes.js
import express from "express";
import roleController from "../controllers/role.controller.js";
import { authenticateJWT} from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin only routes
router.post("/",authenticateJWT ,  authorize("admin") ,  roleController.createRole);
router.get("/", authenticateJWT, authorize("admin"), roleController.getAllRoles);
router.get("/:id", authenticateJWT, authorize("admin"), roleController.getRoleById);
router.put("/:id", authenticateJWT, authorize("admin"), roleController.updateRole);
router.delete("/:id", authenticateJWT, authorize("admin"), roleController.deleteRole);
router.get("/:id/permissions", authenticateJWT, authorize("admin"), roleController.getRoleWithPermissions);

export default router;
