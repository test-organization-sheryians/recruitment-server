import express from "express";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  softDeleteStudent
} from "../controllers/student.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createStudentValidation,
  updateStudentValidation
} from "../middlewares/validators/student.validation.js";

const router = express.Router();

router.post(
  "/",
  validate(createStudentValidation),
  createStudent
);

router.get(
  "/",
  getAllStudents
);

router.get(
  "/:id",
  getStudentById
);

router.patch(
  "/:id",
  validate(updateStudentValidation),
  updateStudent
);

router.delete(
  "/:id",
  softDeleteStudent
);

export default router;