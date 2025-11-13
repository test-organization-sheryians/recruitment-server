// src/routes/permission.routes.js
import express from "express";
import permissionController from "../controllers/permission.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
const router = express.Router();

// Admin only routes
router.post("/", authenticateJWT, authorize("admin"), permissionController.createPermission);
router.get("/", authenticateJWT, authorize("admin"), permissionController.getAllPermissions); 
router.get("/:id", authenticateJWT, authorize("admin"), permissionController.getPermissionById);
router.put("/:id", authenticateJWT, authorize("admin"), permissionController.updatePermission); 
router.delete("/:id", authenticateJWT, authorize("admin"), permissionController.deletePermission);

// Get permissions by role
router.get("/", authenticateJWT, authorize("admin"), permissionController.getPermissionsByRole);

// Check user permission
router.get("/check/user", authenticateJWT, permissionController.checkPermission);

export default router;
