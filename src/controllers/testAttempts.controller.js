import TestAttemptsService from "../services/testAttempts.service.js";

class TestAttemptsController {
  constructor() {
    this.testAttemptsService = new TestAttemptsService();
  }

  async startTest(req, res, next) {
    try {
      const { testId } = req.body;
      const email = req.user.email;

      const attempt = await this.testAttemptsService.startTest(testId, email);

      res.status(201).json({
        success: true,
        data: attempt,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitTest(req, res, next) {
    try {
      const { attemptId } = req.params;
      const updateData = req.body;

      const updatedAttempt = await this.testAttemptsService.updateAttempt(
        attemptId,
        updateData
      );

      res.status(200).json({
        success: true,
        data: updatedAttempt,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserAttempts(req, res, next) {
    try {
      const { testId } = req.params;
      const email = req.user.email;

      const attempts = await this.testAttemptsService.getUserAttempts(
        testId,
        email
      );

      res.status(200).json({
        success: true,
        data: attempts,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TestAttemptsController();
