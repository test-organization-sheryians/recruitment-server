import MongoEnrollmentsRespository from "../repositories/implementations/mongoEnrollmentsRepository.js";
import { AppError } from "../utils/errors.js";

const enrollmentRepo = new MongoEnrollmentsRespository();

export const checkEnrollment = async (req, res, next) => {
  try {
    const testId = req.body.testId || req.params.testId;
    if (!testId && req.method === "GET") {
      return next();
    }
    if (!testId) {
      throw new AppError("Test ID is required.", 400);
    }

    const email = req.user.email;

    const enrollment = await enrollmentRepo.findEnrollment(testId, email);

    if (!enrollment) {
      throw new AppError("You are not enrolled in this test.", 403);
    }

    req.enrollment = enrollment;
    next();
  } catch (error) {
    next(error);
  }
};
