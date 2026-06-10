import express from "express";
import AdminProfileController from "../controllers/adminProfile.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new AdminProfileController();

router.get("/", authenticateJWT, controller.getProfile);
router.patch("/update", authenticateJWT, controller.updateProfile);
router.delete("/delete", authenticateJWT, controller.deleteProfile);

export default router;