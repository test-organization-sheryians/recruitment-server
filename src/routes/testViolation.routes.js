import express from "express";
import { logViolation } from "../controllers/testViolation.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/ViolationReport",authenticateJWT , logViolation);

export default router;