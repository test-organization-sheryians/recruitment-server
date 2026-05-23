import express from "express";
import noteController from "../controllers/note.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import {
  createNoteValidator,
  updateNoteValidator,
} from "../middlewares/validators/note.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/", createNoteValidator, noteController.createNote);
router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);
router.put("/:id", updateNoteValidator, noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

export default router;
