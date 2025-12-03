// routes/user.routes.js
import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { updateUserValidator } from "../middlewares/validators/user.validator.js";

const router = express.Router();

router.get("/me", authenticateJWT, userController.getMe);

router.patch(
  "/me",
  authenticateJWT,
  updateUserValidator,
  userController.updateMe
);

export default router;
