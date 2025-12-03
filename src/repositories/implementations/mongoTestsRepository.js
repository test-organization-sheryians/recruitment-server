import mongoose from "mongoose";
import Tests from "../../models/Tests.js";
import ItestsRepository from "../contracts/ITestsRepository.js";
import { AppError } from "../../utils/errors.js";

class MongoTestRepository extends ItestsRepository {
  async createTest(testData) {
    try {
      const test = new Tests(testData);
      return await test.save();
    } catch (error) {
      throw new AppError(`Failed to create test: ${error.message}`, 500, error);
    }
  }

  async findTestById(id) {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const [tests] = await Tests.aggregate([
        {
          $match: { id: objectId },
        },
        {
          $lookup: {
            from: "testEnrollments",
            localField: "_id",
            foreignField: "testId",
            as: "enrollment",
          },
        },
        { $unwind: "$enrollment", preserveNullAndEmptyArrays: true },
        {
          $lookup: {
            from: "users",
            localField: "Enrollments.email",
            foreignField: "email",
            as: "enrolledUser",
          },
        },
        { $unwind: "$enrolledUser", preserveNullAndEmptyArrays: true },
      ]);
      console.log(tests);
      return tests;
    } catch (error) {
      throw new AppError(`Failed to find test: ${error.message}`, 500, error);
    }
  }

  async findAllPublishedTests() {
    try {
      return await Tests.find({ status: true }).lean();
    } catch (error) {
      throw new AppError(
        `Failed to find published tests: ${error.message}`,
        500,
        error
      );
    }
  }

  async updateTest(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await Tests.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).lean();
    } catch (error) {
      throw new AppError(`Failed to update test: ${error.message}`, 500, error);
    }
  }
}

export default MongoTestRepository;
