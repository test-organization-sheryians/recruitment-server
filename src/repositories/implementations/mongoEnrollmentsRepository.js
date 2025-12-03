import TestEnrollments from "../../models/TestEnrollments";
import { AppError } from "../../utils/errors.js";
import IEnrollment from "../contracts/IEnrollment.js";

class MongoEnrollmentsRespository extends IEnrollment {
  async enrollUser(testId, email) {
    try {
      const newEnrollment = new TestEnrollments({ testId, email });
      return await newEnrollment.save();
    } catch (error) {
      throw new AppError(
        `Failed to enroll user in test: ${error.message}`,
        500,
        error
      );
    }
  }

  async findEnrollment(testId, email) {
    try {
      return await TestEnrollments.findOne({ testId, email }).lean();
    } catch (error) {
      throw new AppError(
        `Failed to find enrollment: ${error.message}`,
        500,
        error
      );
    }
  }

  async findEnrollmentsByUser(email) {
    try {
      const [enrollments] = await TestEnrollments.aggregate([
        {
          $match: { email: email },
        },
        {
          $lookup: {
            from: "tests",
            localField: "testId",
            foreignField: "_id",
            as: "tests",
          },
        },
        {
          $unwind: { path: "$tests", preserveNullAndEmptyArrays: true },
        },
      ]);

      console.log(enrollments);
      return enrollments;
    } catch (error) {
      throw new AppError(
        `Failed to find user enrollments: ${error.message}`,
        500,
        error
      );
    }
  }
}

export default MongoEnrollmentsRespository;
