// src/routes/jobRole.routes.js
import express from "express";
import jobRoleController from "../controllers/jobRole.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  createJobRoleValidator,
  updateJobRoleValidator,
  filterJobRolesValidator,
} from "../middlewares/validators/jobRole.validator.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,

  authorize("admin"),
  createJobRoleValidator,
  jobRoleController.createJobRole
);

router.get("/", filterJobRolesValidator, jobRoleController.getAllJobRoles);

router.get("/:id", jobRoleController.getJobRoleById);

router.put(
  "/:id",
  authenticateJWT,
  authorize("admin"),
  updateJobRoleValidator,
  jobRoleController.updateJobRole
);

router.delete(
  "/:id",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.deleteJobRole
);
router.get(
  "/client/:clientId",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.getJobRolesByClient
);

router.get("/category/:categoryId", jobRoleController.getJobRolesByCategory);

router.get("/status/active", jobRoleController.getActiveJobRoles);

router.get("/status/expired", jobRoleController.getExpiredJobRoles);

export default router;
