import mongoose from "mongoose";
import savedJobModel from "../../models/savedJob.model.js";
import { AppError } from "../../utils/errors.js";
import ISavedJobRepository from "../contracts/ISavedJobRepository.js";
import { paginateAggregation } from "../../utils/pagination.util.js";

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

  async getSavedJob(userId, page = 1, limit = 10) {
    try {
      const pipeline = [
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "jobroles",
            localField: "jobId",
            foreignField: "_id",
            as: "jobId",
          },
        },
        { $unwind: "$jobId" },
        {
          $project: {
            "jobId._id": 1,
            "jobId.title": 1,
            "jobId.description": 1,
            "jobId.company": 1,
            "jobId.location": 1,
            "jobId.salary": 1,
            "jobId.jobType": 1,
            "jobId.expiryDate": 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ];
      return await paginateAggregation(savedJobModel, pipeline, { page, limit });
    } catch (error) {
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
