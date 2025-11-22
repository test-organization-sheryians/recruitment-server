import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";

class MongoApplicationRespository extends IJobApplicationRepository { 

  async createJobApplication(jobAppData) {
    try {
      // Check for duplicate application
      const existing = await jobAppModel.findOne({
        candidateId: jobAppData.candidateId,
jobId: jobAppData.jobId
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
      // Note: This uses 'userId' as the ID to update. Ensure this is the correct Application ID.
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
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update application status", 500);
    }
  }

  // ✅ FIXED: Added .exec() to explicitly execute the Mongoose query.
  async getAllApplications() {
        // The key to returning "all the data" is jobAppModel.find() with no filter arguments.
        return await jobAppModel
            .find()
            // Populate candidate fields
            .populate("candidateId", "firstName lastName email")
            // Populate job fields
            .populate("jobId", "title requiredExperience description")
            .select("-__v") // Exclude the Mongoose version key
             .exec(); // Explicitly execute the query
  }

  // ✅ FIXED: Added .exec() and updated candidate population fields for consistency.
  async filterApplications(status) {
    const filter = {};
    if (status) filter.status = status;

    return await jobAppModel
      .find(filter)
      // Updated fields for consistency
      .populate("candidateId", "firstName lastName email")
      .populate("jobId", "title")
       .exec(); // Explicitly execute the query
  }
}

export default MongoApplicationRespository;