import express from "express";
import testController from "../controllers/tests.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, testController.createTest);

router.get("/published/all", testController.getPublishedTests);

router.get("/:testId", testController.getTest);

router.patch("/:testId", authenticateJWT, testController.updateTest);

export default router;
