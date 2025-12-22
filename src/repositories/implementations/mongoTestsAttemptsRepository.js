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

  async findAttemptsByUser(testId) {
  try {
    const attempts = await TestAttempts.aggregate([
      {
        $match: {
          testId: new mongoose.Types.ObjectId(testId) 
        }
      },
      {
        $lookup: {
          from: "users",           
          localField: "email",     
          foreignField: "email",   
          as: "userInfo"
        }
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          firstName: "$userInfo.firstName",  
          lastName: "$userInfo.lastName"
        }
      },
      {
        $project: {
          userInfo: 0
        }
      },
      {
        $sort: { startTime: -1 }
      }
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

async findAttemptsByEmail(email) {
  try {
    const attempts = await TestAttempts.aggregate([
      // 1️⃣ filter by user
      {
        $match: { email }
      },

      // 2️⃣ join tests collection
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "test"
        }
      },

      // 3️⃣ convert array → object
      {
        $unwind: {
          path: "$test",
          preserveNullAndEmptyArrays: true
        }
      },

      // 4️⃣ shape response exactly for frontend
      {
        $project: {
          _id: 0,

          title: "$test.title",
          summury: "$test.summury",
          duration: "$test.duration",
          passingScore: "$test.passingScore",
          createdAt: "$test.createdAt",
          showResults: "$test.showResults",

          attempt: {
            status: "$status",
            isPassed: "$isPassed",
            score: "$score",
            percentage: "$percentage"
          }
        }
      },

      // 5️⃣ latest attempt first
      {
        $sort: { createdAt: -1 }
      }
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
