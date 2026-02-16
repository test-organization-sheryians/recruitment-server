import express from "express";
import AReviewController from "../controllers/AReview.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const reviewController = new AReviewController();

router.post("/", authenticateJWT, reviewController.createReview);
router.get("/:id", reviewController.getReviewById);
router.get("/product/:productId", reviewController.getReviewsByProduct);
router.patch("/update/:id", authenticateJWT, reviewController.updateReview);
router.delete("/delete/:id", authenticateJWT, reviewController.deleteReview);

export default router;
    