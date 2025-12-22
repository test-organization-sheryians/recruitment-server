import mongoose from "mongoose";
import TestAttempts from "../../models/TestAttempt.js";
import { AppError } from "../../utils/errors.js";
import IAttempts from "../contracts/IAttempts.js";

class MongoTestAttampsRepository extends IAttempts {
  async createTestAttempt(attemptData) {
    try {
      const newAttempt = new TestAttempts(attemptData);
      return await newAttempt.save();
    } catch (error) {
      throw new AppError(
        `Failed to record test attempt: ${error.message}`,
        500,
        error
      );
    }
  }

  // ✅ Keeps Admin/Stat functionality working (Search by Test ID)
  async findAttemptsByUser(testId) {
    try {
      const attempts = await TestAttempts.aggregate([
        {
          $match: {
            testId: new mongoose.Types.ObjectId(testId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "email",
            foreignField: "email",
            as: "userInfo",
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            firstName: "$userInfo.firstName",
            lastName: "$userInfo.lastName",
          },
        },
        {
          $project: {
            userInfo: 0,
          },
        },
        {
          $sort: { startTime: -1 },
        },
      ]);

      return attempts;
    } catch (error) {
      throw new AppError(
        `Failed to find user attempts: ${error.message}`,
        500,
        error
      );
    }
  }

  // ✅ FIXED: Returns Attempt object with nested Test details
  // ❌ REMOVED: 'answers' array is now excluded to reduce payload size
  async findAttemptsByEmail(email) {
    try {
      const attempts = await TestAttempts.aggregate([
        // 1️⃣ Match attempts by the user's email
        {
          $match: { email },
        },

        // 2️⃣ Join with the 'tests' collection to get details
        {
          $lookup: {
            from: "tests",
            localField: "testId",
            foreignField: "_id",
            as: "test",
          },
        },

        // 3️⃣ Unwind the test array so 'test' becomes an object
        {
          $unwind: {
            path: "$test",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 4️⃣ EXCLUDE ANSWERS (The Fix)
        {
          $project: {
            answers: 0,            // 👈 Removes the user's submitted answers
            "test.questions": 0,   // 👈 (Optional) Removes test questions if they are in the Test object
            "test.enrollments": 0, // Cleanup extra fields
            "test.enrolledUsers": 0
          }
        },

        // 5️⃣ Sort by most recent attempt
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return attempts;
    } catch (error) {
      throw new AppError(
        `Failed to find user attempts: ${error.message}`,
        500,
        error
      );
    }
  }

  async updateTestAttempt(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await TestAttempts.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).lean();
    } catch (error) {
      throw new AppError(
        `Failed to update test attempt: ${error.message}`,
        500,
        error
      );
    }
  }
}

export default MongoTestAttampsRepository;