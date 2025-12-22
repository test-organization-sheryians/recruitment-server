import { testGenerator } from "../agents/TestGenerator.js";
import { evaluateTest } from "../agents/TestEvalutor.js";
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

  // async startTest(req, res, next) {
  //   try {
  //     const { testId } = req.body;
  //     const email = req.user.email;

  //     const testSummary = await this.testService.getTestById(testId);

  //     const data = {
  //       title: testSummary.title,
  //       summury: testSummary.summury,
  //       showResults: testSummary.showResults,
  //       category: testSummary.category,
  //       status: testSummary.status,
  //       duration: testSummary.duration,
  //       passingScore: testSummary.passingScore,
  //       prompt: testSummary.prompt,
  //     };

  //     const resfromAI = await testGenerator({ prompt: data });

  //     const attempt = await this.testAttemptsService.startTest(testId, email);

  //     return res.status(201).json({
  //       success: true,
  //       data: attempt,
  //       questions: resfromAI,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async startTest(req, res, next) {
  try {
    const { testId } = req.body;
    const email = req.user.email;

    // 1️⃣ Fetch test config
    const testSummary = await this.testService.getTestById(testId);

    const testConfig = {
      title: testSummary.title,
      summury: testSummary.summury,
      showResults: testSummary.showResults,
      category: testSummary.category,
      status: testSummary.status,
      duration: testSummary.duration,
      passingScore: testSummary.passingScore,
      prompt: testSummary.prompt,
    };

    // 2️⃣ Generate questions from AI (already normalized)
    const aiResult = await testGenerator(testConfig);
    /**
     * aiResult = {
     *   questions: [],
     *   duration: number,
     *   passingScore: number
     * }
     */

    // 3️⃣ Create attempt
    const attempt = await this.testAttemptsService.startTest(testId, email);

    // 4️⃣ EXACT RESPONSE SHAPE (CLIENT SAFE)
    return res.status(201).json({
      success: true,
      data: attempt,
      questions: {
        test: {
          questions: aiResult.questions,
          duration: aiResult.duration,
          passingScore: aiResult.passingScore,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}


  async submitTest(req, res, next) {
    try {
      const attemptId = req.params.attemptId;
      const { testId, questions ,answers } = req.body;

      if (!testId) {
        return res
          .status(400)
          .json({ success: false, message: "testId is required" });
      }

      const test = await this.testService.getTestById(testId);

      const evaluation = await evaluateTest({
        questions: questions,
        answers,
        passingScore: test.passingScore,
        testPrompt:test.prompt
      });

      const updatedAttempt = await this.testAttemptsService.submitTest(
        attemptId,
        {
          testId,
          answers,
          score: evaluation.totalScore,
          percentage: evaluation.percentage,
          isPassed: evaluation.passed,
          status: "Graded",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Test submitted & evaluated successfully",
        evaluation,
        attempt: updatedAttempt,
      });
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
