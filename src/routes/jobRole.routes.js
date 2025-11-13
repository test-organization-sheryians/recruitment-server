// src/routes/jobRole.routes.js
import express from "express";
import jobRoleController from "../controllers/jobRole.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  createJobRoleValidator,
  updateJobRoleValidator,
  filterJobRolesValidator
} from "../middlewares/validators/jobRole.validator.js";

const router = express.Router();

// Main CRUD routes
router.post(
  "/",
  authenticateJWT,
  authorize("admin"),
  createJobRoleValidator,
  jobRoleController.createJobRole
);

router.get(
  "/",
  authenticateJWT,
  authorize("admin"),
  filterJobRolesValidator,
  jobRoleController.getAllJobRoles
);

router.get(
  "/:id",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.getJobRoleById
);

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

// Specialized routes
router.get(
  "/client/:clientId",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.getJobRolesByClient
);

router.get(
  "/category/:categoryId",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.getJobRolesByCategory
);

router.get(
  "/status/active",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.getActiveJobRoles
);

router.get(
  "/status/expired",
  authenticateJWT,
  authorize("admin"),
  jobRoleController.getExpiredJobRoles
); // it won't work , as response is not what we expect  ,there is some missing error handling case/edge cases to handle , while fetching expired roles

export default router;
