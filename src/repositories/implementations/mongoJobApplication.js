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

<<<<<<< HEAD
            }
            async updateApplicationStatus(candidateId, status) {
                        try {
                                    const updateApplicationStatus = await jobAppModel.findByIdAndUpdate(
                                                candidateId,
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
            async getJobApplication() {
                        try {
                                    const jobApplication = await jobAppModel.find();
                                    return jobApplication;
                        } catch (error) {
                                    throw new AppError("Application not found ")
                        }
            }
=======
  async getAllApplications() {
    return await jobAppModel
      .find()
      .populate("candidateId", "name email")
      .populate("jobId", "title");
  }
  async filterApplications(status) {
    const filter = {};
    if (status) filter.status = status;

    return await jobAppModel
      .find(filter)
      .populate("candidateId", "name email")
      .populate("jobId", "title");
  }
>>>>>>> sumitsharma/JobApplication
}

export default MongoApplicationRespository;
