import express from "express";
import { resendVerificationEmailController } from "../controllers/resendMail.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected route
router.post("/resend-verification-email", authenticateJWT, resendVerificationEmailController);

export default router;
