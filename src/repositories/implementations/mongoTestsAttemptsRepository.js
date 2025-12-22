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

async findAttemptsByEmail(email) {               //new one for test attempt by email
  try {
    const attempts = await TestAttempts.find({ email })
      .sort({ startTime: -1 })
      .lean();

    return attempts; // ✅ ARRAY
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
