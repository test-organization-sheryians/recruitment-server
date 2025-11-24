import express from "express";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import jobApplicationController from "../controllers/jobApplication.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
 
  jobApplicationController.applyForJob
);

router.get(
  "/",
  authenticateJWT,
 authorize("admin") , 
  jobApplicationController.getAllApplications
);

router.patch(
  "/:status",
  authenticateJWT,
authorize("admin") , 
  jobApplicationController.updateApplicationStatus
);

router.get(
  "/filter/:status",
  authenticateJWT,
 authorize("admin") , 
  jobApplicationController.filterApplications
);

export default router;
