import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";
import mongoose from "mongoose";

class MongoApplicationRespository extends IJobApplicationRepository {

 
 async createJobApplication(jobAppData) {
  try {
    const jobApplication = new jobAppModel(jobAppData);
    const savedApplication = await jobApplication.save();
    return savedApplication;
  } catch (error) {
    console.error("Error creating job application:", error);
    throw new AppError(`Failed to create job application: ${error.message}`, 500, error);
  }
}
 
  async findByUserAndJob(candidateId, jobId) {
    const result = await jobAppModel.aggregate([
      {
        $match: {
          candidateId: new mongoose.Types.ObjectId(candidateId),
          jobId: new mongoose.Types.ObjectId(jobId)
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate"
        }
      },
      { $unwind: "$candidate" },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },

      {
        $project: {
          status: 1,
          resumeUrl: 1,
          createdAt: 1,

          "candidate.firstName": 1,
          "candidate.lastName": 1,
          "candidate.email": 1,

          "job.title": 1,
          "job.description": 1
        }
      }
    ]);

    return result[0] || null;
  }


  async updateApplicationStatus(candidateId, status) {
    try {
      const updated = await jobAppModel.findByIdAndUpdate(
        candidateId,
        { status },
        { new: true, runValidators: true }
      );

      if (!updated) throw new AppError("Application not found", 404);

      return updated;
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
          as: "candidateDetails"
        }
      },
      { $unwind: "$candidateDetails" },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },

      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          coverletter: 1,
          status: 1,
          createdAt: 1,

          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.email": 1,

          "jobDetails.title": 1,
          "jobDetails.description": 1,
          "jobDetails.requiredExperience": 1
        }
      }
    ]);
  }


  async filterApplications(status) {
    const matchStage = {};
    if (status) matchStage.status = status;

    return await jobAppModel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails"
        }
      },
      { $unwind: "$candidateDetails" },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },

      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,

          "candidateDetails.firstName": 1,
          "candidateDetails.email": 1,

          "jobDetails.title": 1
        }
      }
    ]);
  }
}

export default MongoApplicationRespository;
