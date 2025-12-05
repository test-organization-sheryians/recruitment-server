import { testGenerator } from "../agents/TestGenerator.js";
import TestService from "../services/tests.service.js";

class TestController {
  constructor() {
    this.testService = new TestService();
  }

  async createTest(req, res, next) {
    try {
      const payload = {
        ...req.body,
        createdBy: req.user?._id,
      };

      const resfromAI = await testGenerator({ prompt: req.body });
      console.log("res from ai " , resfromAI);

      const test = await this.testService.createTest(payload);
      res.status(201).json({ success: true, data: test , questions:resfromAI });
    } catch (error) {
      next(error);
    }
  }

  async getTest(req, res, next) {
    try {
      const test = await this.testService.getTestById(req.params.testId);
      res.status(200).json({ success: true, data: test });
    } catch (error) {
      next(error);
    }
  }

  async getPublishedTests(req, res, next) {
    try {
      const tests = await this.testService.findAllPublishedTests();
      res.status(200).json({ success: true, data: tests });
    } catch (error) {
      next(error);
    }
  }

  async updateTest(req, res, next) {
    try {
      const updated = await this.testService.testRepository.updateTest(
        req.params.testId,
        req.body
      );
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export default new TestController();
