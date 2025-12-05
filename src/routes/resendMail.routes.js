import express from "express";
import { resendVerificationEmailController } from "../controllers/resendMail.controller.js";

const router = express.Router();

// Protected route
router.post("/resend-verification-email", resendVerificationEmailController);

export default router;
