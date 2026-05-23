import express from "express";
import StudentUserController from "../controllers/studentUser.controller.js";

const router = express.Router();

router.post("/", StudentUserController.createUser);

router.get("/", StudentUserController.getAllUsers);

router.get("/:id", StudentUserController.getUserById);

router.put("/:id", StudentUserController.updateUser);

router.delete("/:id", StudentUserController.deleteUser);

export default router;