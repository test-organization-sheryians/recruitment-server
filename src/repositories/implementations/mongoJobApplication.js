import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";

class MongoApplicationRespository extends IJobApplicationRepository {
  async createJobApplication(jobAppData) {
    try {
      // console.log("candidateId:", jobAppData.candidateId);
      // console.log("jobId:", jobAppData.jobId);

      // Check existing application
      const existing = await jobAppModel.findOne({
        candidateId: jobAppData.candidateId,
        jobId: jobAppData.jobId,
      });

      if (existing) {
        console.log("Duplicate Found:", existing);
        throw new AppError("You have already applied for this job", 409);
      }

      // Create new application
      const jobApp = await jobAppModel.aggregate([
        {
          $project: {
            "candidate.password": 0,
            "candidate.__v": 0,
            "candidate.createdAt": 0,
            "candidate.updatedAt": 0,
            "candidate.roleId": 0,

            "job.__v": 0,
            "job.createdAt": 0,
            "job.updatedAt": 0,

            __v: 0,
          },
        },
      ]);
      return;
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
  // old get all application
  // async getAllApplications() {
  //   return await jobAppModel
  //     .find()
  //     .populate("candidateId", "name email")
  //     .populate("jobId", "title");
  // }

  //new get all job appplication with aggregation pipeline
  async getAllApplications() {
    return await jobAppModel.aggregate([
      {
        $lookup: {
          from: "jobroles", // ✔ correct collection
          localField: "jobId", // ✔ field from jobapplications
          foreignField: "_id",
          as: "jonDetails",
        },
      },
      { $unwind: "$jobDetails" },
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      { $unwind: "$candidateDetails" },
      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          coverletter: 1,
          status: 1,
          createdAt: 1,

          //job details
          "jobDetails.title": 1,
          "jobDetails.requiredExperience": 1,
          "jobDetails.description": 1,

          // candidate info
          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.email": 1,
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
