import express from "express";
import SharePortfolioController from "../controllers/sharePortfolio.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const sharePortfolioController = new SharePortfolioController();

// AUTH REQUIRED - Create share link
router.post(
  "/",
  authenticateJWT,
  sharePortfolioController.createSharePortfolio,
);

// PUBLIC - View shared portfolios (NO AUTH!)
router.get("/:shareId", sharePortfolioController.getSharedPortfolio);

export default router;
