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

  async findAttemptsByUser(testId, email) {
    try {
      return await TestAttempts.find({ testId, email })
        .sort({ startTime: -1 })
        .lean();
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
