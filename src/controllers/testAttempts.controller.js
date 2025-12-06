import { testGenerator } from "../agents/TestGenerator.js";
import TestAttemptsService from "../services/testAttempts.service.js";
import TestService from "../services/tests.service.js";



class TestAttemptsController {
  constructor() {
    this.testAttemptsService = new TestAttemptsService();


    this.startTest = this.startTest.bind(this);
    this.submitTest = this.submitTest.bind(this);
    this.getUserAttempts = this.getUserAttempts.bind(this);

    this.testService = new TestService();
  }

  async startTest(req, res, next) {
    try {
      const { testId } = req.body;
      const email = req.user.email;

      const testSummary = await this.testService.getTestById(testId);
      // const payload = {

      // }

      const data = {
        title:testSummary.title,
          summury:testSummary.summury,
        showResults:testSummary.showResults,
          category:testSummary.category,
        status:testSummary.status,
          duration:testSummary.duration,
        passingScore:testSummary.passingScore,
          prompt:testSummary.prompt,
      }
      // // console.log("test summary -----> ", testSummary.title);
      // console.log("////////////////////////////////");
      // console.log(data);
      // console.log("hehehehhe ----------------------------")

      const resfromAI = await testGenerator({prompt : data});
      console.log("////////////////////////////////");
      console.log(resfromAI);
      console.log("hehehehhe ----------------------------")

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
