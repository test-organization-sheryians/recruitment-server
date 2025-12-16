import mongoose from "mongoose";
import savedJobModel from "../../models/savedJob.model.js";
import { AppError } from "../../utils/errors.js";
import ISavedJobRepository from "../contracts/ISavedJobRepository.js";

class MongoSavedJobRepository extends ISavedJobRepository {

  async saveJob(userId, jobId) {
    try {
      return await savedJobModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        jobId: new mongoose.Types.ObjectId(jobId),
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job already saved", 409);
      }
      throw new AppError("Unable to save job", 500);
    }
  }

  async getSavedJob(userId) {
    try {
      return await savedJobModel
        .find({ userId: new mongoose.Types.ObjectId(userId) })
        .select("-userId -__v")
        .populate({
          path: "jobId",
          select: "-skills -__v",
        })
        .lean();
    } catch {
      throw new AppError("Unable to fetch saved jobs", 500);
    }
  }

  async removeSavedJob(userId, jobId) {
    try {
      const deleted = await savedJobModel.findOneAndDelete({
        userId: new mongoose.Types.ObjectId(userId),
        jobId: new mongoose.Types.ObjectId(jobId),
      });

      if (!deleted) {
        throw new AppError("Saved job not found", 404);
      }

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unable to remove saved job", 500);
    }
  }
}

export default MongoSavedJobRepository;
