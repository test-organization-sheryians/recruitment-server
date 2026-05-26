import express from "express";
import studentsController from "../controllers/students.controllers.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

import {
  createStudentsProfileValidator,
  updateStudentsProfileValidator,
} from "../middlewares/validators/students.validator.js";

const  StudentsRouter = express.Router();

 StudentsRouter.use(authenticateJWT);

 StudentsRouter.post(
  "/createStudentsProfile",
  createStudentsProfileValidator,
  studentsController.createStudentsProfile
);

 StudentsRouter.get(
  "/getStudentsProfile",
  studentsController.getAllStudentsProfile
);

 StudentsRouter.get(
  "/getStudentsProfileById/:id",
  studentsController.getStudentsProfileById
);

 StudentsRouter.patch(
  "/updateStudentsProfile/:id",
  updateStudentsProfileValidator,
  studentsController.updateStudentsProfile
);

 StudentsRouter.delete(
  "/deleteStudentsProfile/:id",
  studentsController.deleteStudentsProfile
);

export default StudentsRouter;