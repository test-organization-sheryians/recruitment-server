import express from "express";
import jobPostController from "../controllers/jobPost.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  createJobPostValidator,
  updateJobPostValidator,
} from "../middlewares/validators/jobPost.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post(
  "/",
  authorize("admin"),
  createJobPostValidator,
  jobPostController.createJobPost,
);

router.get("/:id", jobPostController.getJobPostById);

router.get("/", jobPostController.getAllJobPosts);

router.put(
  "/:id",
  authorize("admin"),
  updateJobPostValidator,
  jobPostController.updateJobPost,
);

router.delete("/:id", authorize("admin"), jobPostController.deleteJobPost);

export default router;
