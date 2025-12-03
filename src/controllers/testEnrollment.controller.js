import TestEnrollmentService from "../services/testEnrollments.service.js";

class EnrollmentController {
  constructor() {
    this.enrollmentService = new TestEnrollmentService();
  }

  async enrollUser(req, res, next) {
    try {
      const { testId, email } = req.body;

      const enrollment = await this.enrollmentService.enrollUser(testId, email);

      res.status(201).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssignedTests(req, res, next) {
    try {
      const { email } = req.params;

      const assignedTests = await this.enrollmentService.getAssignedTests(
        email
      );

      res.status(200).json({
        success: true,
        data: assignedTests,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EnrollmentController();
