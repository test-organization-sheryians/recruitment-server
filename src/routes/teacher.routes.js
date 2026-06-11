import express from "express";
import teacherController from "../controllers/teacher.controller.js";

const router = express.Router();



router.post("/", teacherController.createTeacher);
router.get("/:id", teacherController.getTeacher);
router.put("/:id", teacherController.updateTeacher);
router.delete("/:id", teacherController.deleteTeacher);
router.get("/", teacherController.getAllTeachers);

export default router;