import studentService from "../services/studentsProfile.service.js";
class StudentsController {
  createStudentsProfile = async (req, res, next) => {
    try {
      const student = await studentService.createStudentsProfile(
        req.body,
        req.userId
      );

      res.status(201).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllStudentsProfile = async (req, res, next) => {
    try {
      const students = await studentService.getAllStudentsProfile(
        req.userId
      );

      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  };

  getStudentsProfileById = async (req, res, next) => {
    try {
      const student = await studentService.getStudentsProfileById(
        req.params.id,
        req.userId
      );

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStudentsProfile = async (req, res, next) => {
    try {
      const student = await studentService.updateStudentsProfile(
        req.params.id,
        req.body,
        req.userId
      );

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteStudentsProfile = async (req, res, next) => {
    try {
      await studentService.deleteStudentsProfile(
        req.params.id,
        req.userId
      );

      res.status(200).json({
        success: true,
        message: "Student profile deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new StudentsController();