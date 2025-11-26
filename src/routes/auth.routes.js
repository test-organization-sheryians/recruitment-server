import express from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidator, loginValidator, resetPasswordValidator, googleLoginValidator } from "../middlewares/validators/auth.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/refresh", authController.refreshTokenController);

// routes/auth.routes.js
router.post("/google", googleLoginValidator, authController.googleLogin);

router.post("/logout", authController.logout);

router.put(
  "/reset-password",
  authenticateJWT,
  resetPasswordValidator,
  authController.resetPassword
);

export default router;
