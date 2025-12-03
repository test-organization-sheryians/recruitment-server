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
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const objectId = new mongoose.Types.ObjectId(id);

      const [test] = await Tests.aggregate([
        { $match: { _id: objectId } },

        {
          $lookup: {
            from: "testenrollments",
            localField: "_id",
            foreignField: "testId",
            as: "enrollments",
          },
        },

        {
          $lookup: {
            from: "users",
            let: { emails: "$enrollments.email" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$email", { $ifNull: ["$$emails", []] }] },
                },
              },
              { $project: { password: 0, __v: 0 } },
            ],
            as: "enrolledUsers",
          },
        },
        {
          $addFields: {
            enrolledCount: { $size: "$enrollments" },
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      return test || null;
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
