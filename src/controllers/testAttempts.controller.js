import TestAttemptsService from "../services/testAttempts.service.js";

class TestAttemptsController {
  constructor() {
    this.testAttemptsService = new TestAttemptsService();

    this.startTest = this.startTest.bind(this);
    this.submitTest = this.submitTest.bind(this);
    this.getUserAttempts = this.getUserAttempts.bind(this);
  }

  async startTest(req, res, next) {
    try {
      const { testId } = req.body;
      const email = req.user.email;

      const attempt = await this.testAttemptsService.startTest(testId, email);

      return res.status(201).json({ success: true, data: attempt });
    } catch (error) {
      next(error);
    }
  }

  async submitTest(req, res, next) {
    try {
      const attemptId = req.params.attemptId;
      const testResults = req.body;

      const updatedAttempt = await this.testAttemptsService.submitTest(
        attemptId,
        testResults
      );

      return res.status(200).json({ success: true, data: updatedAttempt });
    } catch (error) {
      next(error);
    }
  }

  async getUserAttempts(req, res, next) {
    try {
      const testId = req.params.testId;
      const email = req.user.email;

      const attempts =
        await this.testAttemptsService.testAttemptsRepogitory.findAttemptsByUser(
          testId,
          email
        );

      return res.status(200).json({ success: true, data: attempts });
    } catch (error) {
      next(error);
    }
  }
}

export default new TestAttemptsController();
