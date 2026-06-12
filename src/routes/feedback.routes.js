import express from "express";
import FeedbackController from "../controllers/feedback.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, FeedbackController.createFeedback);

router.get("/", authenticateJWT, FeedbackController.getAllFeedbacks);

router.get("/candidate/:candidateId", authenticateJWT,
  FeedbackController.getFeedbackByCandidate,
);

router.delete("/:id", authenticateJWT, FeedbackController.deleteFeedback);

export default router;
