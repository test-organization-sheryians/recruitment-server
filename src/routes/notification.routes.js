import express from "express"
import NotificationController from "../controllers/notification.controller.js"
import {
  createNotificationValidator,
  updateNotificationValidator,
} from "../middlewares/validators/notification.validator.js"
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post(
  "/",
  authenticateJWT,
  createNotificationValidator,
  NotificationController.createNotification
)
router.get("/me", authenticateJWT, NotificationController.getMyNotifications)
router.get("/:id", authenticateJWT, NotificationController.findNotificationById)
router.patch(
  "/:id/read",
  authenticateJWT,
  updateNotificationValidator,
  NotificationController.markAsRead
)
router.delete("/:id/delete", authenticateJWT, NotificationController.deleteNotification)

export default router;
