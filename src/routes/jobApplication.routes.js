import express from "express";
// import uploadResume from "../middlewares/uploadResume.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { applyForJob } from "../controllers/jobApplication.controller.js";

const router = express.Router();


router.post("/:jobId", authenticateJWT, applyForJob);





export default router;
