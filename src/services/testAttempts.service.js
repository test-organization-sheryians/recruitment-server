import MongoEnrollmentsRespository from "../repositories/implementations/mongoEnrollmentsRepository.js"
import MongoTestAttampsRepository from "../repositories/implementations/mongoTestsAttemptsRepository.js"
import MongoTestRepository from "../repositories/implementations/mongoTestsRepository.js"
import { AppError } from "../utils/errors.js"

class TestAttemptsService {
  constructor() {
    this.testAttemptsRepogitory = new MongoTestAttampsRepository()
    this.enrollmentReposetory = new MongoEnrollmentsRespository()
    this.testRepository = new MongoTestRepository()
  }

 async startTest(testId, email, extra = {}) {
   const enrollment = await this.enrollmentReposetory.findEnrollment(testId, email)
    console.log(enrollment)

    if (!enrollment) {
      throw new AppError("you are not enrolled for this test.", 409)
    }
      
    // 2️⃣ Block re-attempt
    if (enrollment.status === "Completed" || enrollment.status === "Graded" ) {
      throw new AppError("You have already completed this test.", 409)
    }

    // 3️⃣ Block Disqualified users
if (enrollment.status === "Disqualified" || enrollment.status === "disqualified") {
  throw new AppError("You have been disqualified from this test and cannot restart.", 403);
}

// 🔥 CHECK FOR ACTIVE ATTEMPT
  const existingAttempt = await this.testAttemptsRepogitory.findActiveAttempt(
    testId,
    email
  );

  if (existingAttempt) {
    console.log("Resuming existing attempt");
    return existingAttempt; // ✅ Resume instead of creating new
  }

    await this.enrollmentReposetory.updateEnrollmentStatus(enrollment._id, "Started")
  const attemptData = {
    testId,
    email,
    score: 0,
    percentage: 0,
    startTime: new Date(),
    status: "Started",
    answers: [],
    questions: extra.questions,
  };

  const newAttempt = await this.testAttemptsRepogitory.createTestAttempt(
    attemptData
  );

  if (!newAttempt) {
    throw new AppError("Error while starting the test", 500);
    }
    return newAttempt
  }


  async submitTest(attemptId, testResults) {
    const test = await this.testRepository.findTestById(testResults.testId)
    if (!test) {
      throw new AppError("Test not found", 404)
    }

    const updatedAttempt = await this.testAttemptsRepogitory.updateTestAttempt(attemptId, {
      testId: testResults.testId,
      answers: testResults.answers,
      score: testResults.score,
      percentage: testResults.percentage,
      isPassed: testResults.isPassed,
      status: testResults.status,
      endTime: new Date(),
    })

    if (!updatedAttempt) {
      throw new AppError("Test attempt not found", 404)
    }

    const enrollment = await this.enrollmentReposetory.findEnrollment(
      testResults.testId,
      updatedAttempt.email
    )

    if (!enrollment) {
      throw new AppError("Enrollment not found", 404)
    }

    const finalStatus = testResults.status || "Completed";
    await this.enrollmentReposetory.updateEnrollmentStatus(enrollment._id, finalStatus)

    return updatedAttempt
  }

  async getAttemptsForCandidate(testId, email) {
    if (!testId || !email) {
      throw new AppError("testId and email are required", 400)
    }

    return this.testAttemptsRepogitory.findAttemptsByCandidate(testId, email)
  }
}

export default TestAttemptsService
