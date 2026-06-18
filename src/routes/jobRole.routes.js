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
import jobSearchController from "../controllers/jobSearch.controller.js";
import locationSearchController from "../controllers/locationSearch.controller.js";

const router = express.Router();


// job search 
router.get("/search",authenticateJWT,jobRoleController.searchJobsJobRoles);

// Typeahead title suggestions (new) — public, no auth needed
router.get("/suggestions", jobSearchController.search);

// Location typeahead suggestions (public, no auth)
router.get("/location-suggestions", locationSearchController.search);



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
  filterJobRolesValidator,
  jobRoleController.getAllJobRoles
);

router.get(
  "/:id",
  authenticateJWT,
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

// Explore by Category → job count
router.get(
  "/category/job-count",
  authenticateJWT,
  jobRoleController.getJobCountByCategory
);

router.get(
  "/category/:categoryId",authenticateJWT,
  jobRoleController.getJobRolesByCategory
);

router.get(
  "/status/active",
  jobRoleController.getActiveJobRoles
);

router.get(
  "/status/expired",
  jobRoleController.getExpiredJobRoles
); // it won't work , as response is not what we expect  ,there is some missing error handling case/edge cases to handle , while fetching expired roles



export default router;
