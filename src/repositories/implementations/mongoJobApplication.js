import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";

class MongoApplicationRespository extends IJobApplicationRepository {
  async createJobApplication(jobAppData) {
    try {
      const jobApp = await jobAppModel.create(jobAppData);
      return jobApp;
    } catch (error) {
      console.log("DB Error:", error);
      if (error.code === 11000) {
        throw new AppError("You have already applied for this job", 409);
      }
      throw new AppError("Failed to create job application", 500);
    }
  }
  async findByUserAndJob(userId, jobId) {
    return await jobAppModel.findOne({ userId, jobId });
  }
  async updateApplicationStatus(userId, status) {
    try {
      // last me ayah check kr lena sumit thoda issue dega
      const updateApplicationStatus = await jobAppModel.findByIdAndUpdate(
        userId,
        { status },
        { new: true, runValidators: true }
      );
      if (!updateApplicationStatus) {
        throw new AppError("Application not found", 404);
      }
      return updateApplicationStatus;
    } catch (error) {
      throw new AppError("Failed to update application status", 500);
    }
  }

  async getAllApplications() {
    return await jobAppModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $project: {
          _id: 1,
          status: 1,
          message: 1,
          resumeUrl: 1,
          appliedAt: 1,
          "candidate.firstName": 1,
          "candidate.lastName": 1,
          "candidate.email": 1,
          "job.title": 1,
          "job.requiredExperience": 1,
        },
      },
    ]);
  }
  async filterApplications(status) {
    const filter = {};
    if (status) filter.status = status;

    return await jobAppModel.aggregate([
      { $match: { status } },
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $project: {
          _id: 1,
          status: 1,
          message: 1,
          resumeUrl: 1,
          appliedAt: 1,
          "candidate.firstName": 1,
          "candidate.lastName": 1,
          "candidate.email": 1,
          "job.title": 1,
          "job.requiredExperience": 1,
        },
      },
    ]);
  }
}

export default MongoApplicationRespository;
