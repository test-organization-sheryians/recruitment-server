import express from "express";
import messageController from "../controllers/message.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticateJWT, messageController.createMessage);
router.get("/:id", authenticateJWT, messageController.findMessageById);
router.put("/:id", authenticateJWT, messageController.updateMessage);
router.delete("/:id", authenticateJWT, messageController.deleteMessage);
router.get("/", authenticateJWT, messageController.getAllMessages);

export default router;