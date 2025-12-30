import { emailQueue } from "../queues/emailQueue.js"
import MongoEnrollmentsRespository from "../repositories/implementations/mongoEnrollmentsRepository.js"
import logger from "../utils/logger.js"
import Tests from "../models/Tests.js";

class TestEnrollmentService {
  constructor() {
    this.testEnrollmentRepository = new MongoEnrollmentsRespository()
  }

  async enrollUser(testId, email) {
    const { enrollment, isNew } = await this.testEnrollmentRepository.enrollUser(testId, email)

    if (!isNew) {
      throw new AppError("User is already enrolled for this test.", 409)
    }

    const res = enrollment

    try {
      // ADD JOB TO BULLMQ QUEUE — NOT SEND EMAIL DIRECTLY
      await emailQueue.add(
        "enroll-candidate",
        {
          to: email.toLowerCase().trim(),
          name: "Candidate",
          testId: res?.testId.toString(),
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      )

      logger.info(`test enroll email job queued for ${email}`, {
        testId: res?.testId.toString(),
      })
    } catch (error) {
      logger.warn("Failed to queue enroll email", {
        email: email,
        testId: res?.testId.toString(),
        error: error.message,
      })
      console.log(error)
    }

    return res
  }

  async getAssignedTests(email) {
    return await this.testEnrollmentRepository.findEnrollmentsByUser(email)
  }

  async enrollUsersBulk(testId, emails) {
  const result =
    await this.testEnrollmentRepository.bulkCreateEnrollment(testId, emails);

  const test = await Tests.findById(testId).select("title").lean();

  try {
    const jobs = result.newEmails.map((email) => ({
      name: "enroll-candidate",
      data: {
        to: email.toLowerCase().trim(),
        name: "Candidate",
        testId: testId.toString(),
        testTitle: test?.title || "Sheryians Assessment test",
      },
      opts: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }));

    if (jobs.length > 0) {
      await emailQueue.addBulk(jobs);
      logger.info(`Queued ${jobs.length} bulk enrollment emails`, { testId });
    }
  } catch (error) {
    logger.warn("Failed to queue bulk emails", {
      testId,
      error: error.message,
    });
  }

  return {
    success: true,
    message:
      result.insertedCount === 0
        ? "All selected users are already enrolled for this test."
        : "Users enrolled successfully.",
    insertedCount: result.insertedCount,
    skippedCount: result.skippedCount,
    totalProvided: emails.length,
  };
}

}

export default TestEnrollmentService
