import express from "express";
import reviewController from "../controllers/review.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, reviewController.createReview);

router.get("/user/:userId", reviewController.getReviewsByUser);

router.get("/:id", reviewController.getReviewById);

router.put("/:id", authenticateJWT, reviewController.updateReview);

router.delete("/:id", authenticateJWT, reviewController.deleteReview);

router.get("/rating/:userId", reviewController.getAverageRating);

export default router;