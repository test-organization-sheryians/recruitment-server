import express from "express";
import passwordController from "../controllers/password.controller.js";
import { forgotPasswordValidator, resetPasswordValidator } from "../middlewares/validators/password.validator.js";

const router = express.Router();

router.post("/forgot-password",forgotPasswordValidator, passwordController.forgotPassword);
router.post("/reset-password",resetPasswordValidator, passwordController.resetPassword);

export default router;