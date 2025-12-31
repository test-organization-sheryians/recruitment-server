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

        const enrollment =
    await this.enrollmentReposetory.findEnrollment(testId, email);
    console.log(enrollment);


    if (!enrollment) {
      throw new AppError("you are not enrolled for this test.",409)
    }

    
  // 2️⃣ Block re-attempt
  if (enrollment.status === "Started") {
    throw new AppError(
      "You have already started this test. Re-attempt is not allowed.",
      409
    );
  }

  if (enrollment.status === "Completed") {
    throw new AppError(
      "You have already completed this test.",
      409
    );
  }


  await this.enrollmentReposetory.updateEnrollmentStatus(
     enrollment._id,
    "Started"
  )
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
      {
        testId: testResults.testId,
        answers: testResults.answers,
        score: testResults.score,
        percentage: testResults.percentage,
        isPassed: testResults.isPassed,
        status: testResults.status,
        endTime: new Date(),
      }
    );

    if (!updatedAttempt) {
      throw new AppError("Test attempt not found", 404);
    }
      await this.enrollmentReposetory.updateEnrollmentStatus(
  testResults.testId,
  updatedAttempt.email,
  "Completed"
);

    return updatedAttempt;
  }

  async getAttemptsForCandidate(testId, email) {
    if (!testId || !email) {
      throw new AppError("testId and email are required", 400);
    }

    return this.testAttemptsRepogitory.findAttemptsByCandidate(testId, email);
  }

}

export default TestAttemptsService;
