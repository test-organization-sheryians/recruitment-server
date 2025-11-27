import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { updateUserValidator } from "../middlewares/validators/user.validator.js";

const router = express.Router();

// Self-access
router.get("/me", authenticateJWT, userController.getMe);
router.patch("/me", authenticateJWT, updateUserValidator, userController.updateMe);

// Admin routes
router.get("/allUser", authenticateJWT, authorize("admin"), userController.getAllUsers);

router.put(
  "/:id/role",
  authenticateJWT,
  authorize("admin"),
  userController.updateUserRole
);

router.delete("/:id", authenticateJWT, authorize("admin"), userController.deleteUser);

export default router;
