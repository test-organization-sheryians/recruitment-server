import MongoEnrollmentsRespository from "../repositories/implementations/mongoEnrollmentsRepository.js";
import MongoTestAttampsRepository from "../repositories/implementations/mongoTestsAttemptsRepository.js";
import MongoTestRepository from "../repositories/implementations/mongoTestsRepository.js";
import { AppError } from "../utils/errors.js";

class TestAttemptsService {
  constructor() {
    this.testAttemptsRepogitory = new MongoTestAttampsRepository();
    this.enrollmentReposetory = new MongoEnrollmentsRespository();
    this.testRepository = new MongoTestRepository();
  }

  async startTest(testId, email) {
    const attemptData = {
      testId,
      email,
      score: 0,
      percentage: 0,
      startTime: new Date(),
      status: "Started",
      answers: [],
    };

    const newAttempt = await this.testAttemptsRepogitory.createTestAttempt(
      attemptData
    );
    if (!newAttempt) {
      throw new AppError("Error while starting the test", 500);
    }
    return newAttempt;
  }

  async submitTest(attemptId, testResults) {
    const test = await this.testRepository.findTestById(testResults.testId);
    if (!test) {
      throw new AppError("Test not found", 404);
    }

    const updatedAttempt = await this.testAttemptsRepogitory.updateTestAttempt(
      attemptId,
      testResults
    );

    return updatedAttempt;
  }
}

export default TestAttemptsService;
