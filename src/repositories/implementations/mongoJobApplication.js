import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";

class MongoApplicationRespository extends IJobApplicationRepository {
  async createJobApplication(jobAppData) {
    try {
      // Check for duplicate application
      const existing = await jobAppModel.findOne({
        candidateId: jobAppData.candidateId,
        jobId: jobAppData.jobId,
      });

      if (existing) {
        throw new AppError("You have already applied for this job", 409);
      }

      // Create new application
      const newApplication = await jobAppModel.create(jobAppData);

      return newApplication;
    } catch (error) {
      console.log("DB Error:", error);
      throw error;
    }
  }

  async findByUserAndJob(userId, jobId) {
    return await jobAppModel.findOne({ userId, jobId });
  }

  async updateApplicationStatus(userId, status) {
    try {
      const updated = await jobAppModel.findByIdAndUpdate(
        userId,
        { status },
        { new: true, runValidators: true }
      );

      if (!updated) {
        throw new AppError("Application not found", 404);
      }

      return updated;
    } catch (error) {
      throw new AppError("Failed to update application status", 500);
    }
  }

  // 🔥 NEW simple getAllApplications (NO aggregation)
  async getAllApplications() {
    return await jobAppModel
      .find()
      .populate("candidateId", "firstName lastName email")
      .populate("jobId", "title requiredExperience description")
      .select("-__v");
  }

  async filterApplications(status) {
    const filter = {};
    if (status) filter.status = status;

    return await jobAppModel
      .find(filter)
      .populate("candidateId", "name email")
      .populate("jobId", "title");
  }
}

export default MongoApplicationRespository;
