import express from "express";
//import * as jobValidator from "../middlewares/validators/jobApplication.validator.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import jobApplicationController from "../controllers/jobApplication.controller.js";
import { createJobValidator, updateJobStatus } from "../middlewares/validators/jobApplication.validator.js";


const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  createJobValidator ,
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
updateJobStatus,
  jobApplicationController.updateApplicationStatus
);

router.get(
  "/filter/:status",
  authenticateJWT,
 authorize("admin") , 

  jobApplicationController.filterApplications
);

export default router;
