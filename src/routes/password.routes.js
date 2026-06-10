import express from "express";
import passwordController from "../controllers/password.controller.js";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} from "../middlewares/validators/password.validator.js";
import authenticateJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  passwordController.forgotPassword,
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  passwordController.resetPassword,
);
router.patch(
  "/update-password",
  authenticateJWT,
  updatePasswordValidator,
  passwordController.updatePassword,
);

export default router;
