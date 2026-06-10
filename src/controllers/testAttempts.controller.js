import { testGenerator } from "../agents/TestGenerator.js";
import { evaluateTest } from "../agents/TestEvalutor.js";
import TestAttemptsService from "../services/testAttempts.service.js";
import TestService from "../services/tests.service.js";
import { sendTestResultEmail } from "../services/sendMailServices/sendTestResultMarksEmail.js";

class TestAttemptsController {
  constructor() {
    this.testAttemptsService = new TestAttemptsService();

    this.startTest = this.startTest.bind(this);
    this.submitTest = this.submitTest.bind(this);
    this.getUserAttempts = this.getUserAttempts.bind(this);
    this.getCandidateAttempts = this.getCandidateAttempts.bind(this);
    this.testService = new TestService();
    this.publishTestResults = this.publishTestResults.bind(this);
    this.testAttemptsRepository = this.testAttemptsService.testAttemptsRepogitory ;

  }

  async startTest(req, res, next) {
    try {
      const { testId } = req.body;
      const email = req.user.email;

      const testSummary = await this.testService.getTestById(testId);

      const allPreviousAttempts = await this.testService.testRepository.findAttemptsByTest(testId) || [];
     const usedQuestions = allPreviousAttempts.flatMap((attempt) =>
      attempt.questions ? attempt.questions.map((q) => q.questionText) : []
    );

      const testConfig = {
        title: testSummary.title,
        summury: testSummary.summury,
        showResults: testSummary.showResults,
        category: testSummary.category,
        status: testSummary.status,
        duration: testSummary.duration,
        passingScore: testSummary.passingScore,
        prompt: testSummary.prompt,

        userSeed: `${req.user.email}-${testId}`,
        excludeQuestions: usedQuestions.slice(-40),
      };

      const aiResult = await testGenerator(testConfig);
      const attempt = await this.testAttemptsService.startTest(testId, email, {
        questions: aiResult.questions,
      });

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

  async getAttemptById(attemptId) {
    const attempt = await this.testAttemptsRepository.findById(attemptId);

    if (!attempt) {
      throw new AppError("Test attempt not found", 404);
    }

    return attempt;
  }

  async submitTest(req, res, next) {
    try {
      const attemptId = req.params.attemptId;
      const { testId, answers, isDisqualified = false } = req.body;

      if (!testId) {
        return res
          .status(400)
          .json({ success: false, message: "testId is required" });
      }

      if (isDisqualified) {
        const updatedAttempt = await this.testAttemptsService.submitTest(
          attemptId,
          {
            testId,
            answers,
            score: 0,
            percentage: 0,
            isPassed: false,
            status: "Disqualified",
          }
        );
        return res.status(200).json({
          success: true,
          message: "Attempt recorded as disqualified",
          attempt: updatedAttempt,
        });
      }

      const test = await this.testService.getTestById(testId);

      const attempt = await this.getAttemptById(attemptId);

      const evaluation = await evaluateTest({
        questions: attempt.questions,
        answers,
        passingScore: test.passingScore,
        testPrompt: test.prompt,
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

  async getCandidateAttempts(req, res, next) {
    try {
      const { testId } = req.params;
      const email = req.user.email; // 🔐 from JWT

      const attempts = await this.testAttemptsService.getAttemptsForCandidate(
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

  async publishTestResults(req, res, next) {
    try {
      const { testId } = req.params;
      const test = await this.testService.testRepository.enableShowResults(testId);
      if (!test) {
        return res.status(404).json({
          success: false,
          message: "Test not found",
        });
      }

      if (test.alreadyEnabled) {
        return res.status(400).json({
          success: false,
          message: "Results already published",
        });
      }

      const attempts =
        await this.testAttemptsService.testAttemptsRepogitory.findAttemptsforEmail(
          testId
        );

      for (const attempt of attempts) {
        await sendTestResultEmail({
          to: attempt.email,
          name: `${attempt.firstName} ${attempt.lastName}`,
          testTitle: test.title,
          score: attempt.score,
          percentage: attempt.percentage,
          isPassed: attempt.isPassed,
          resultLink: `https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/tests`,
        });
      }
      res.status(200).json({
        success: true,
        message: "Results published and emails sent successfully",
        emailSent: attempts.length,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  
}

export default new TestAttemptsController();
