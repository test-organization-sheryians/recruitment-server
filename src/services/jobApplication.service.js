import JobRole from "../models/jobRole.model.js";
import { AppError } from "../utils/errors.js";
import MongoJobApplicationRepository from "../repositories/implementations/mongoJobApplicationRepository.js";

class JobApplicationService {
  constructor() {
    this.jobAppRepo = new MongoJobApplicationRepository();
  }

  async applyForJob({ jobId, candidateId, message, resumeFile }) {
    const job = await JobRole.findById(jobId);
    if (!job) throw new AppError("Job not found.", 404);

    if (new Date(job.expiry) < new Date()) {
      throw new AppError("Job has expired.", 400);
    }

    const existingApp = await this.jobAppRepo.findByUserAndJob(
      candidateId,
      jobId
    );
    if (existingApp) {
      throw new AppError("You have already applied for this job.", 400);
    }

    const newApp = await this.jobAppRepo.createJobApplication({
      jobId,
      candidateId,
      message,
      resumeUrl: resumeFile.path || resumeFile.url,
    });

    return newApp;
  }

  async getAllApplications() {
    return await this.jobAppRepo.getAllApplications();
  }

  async updateApplicationStatus(applicationId, status) {
    const validStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "forwarded",
      "interview",
      "hired",
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid status value.", 400);
    }

    return await this.jobAppRepo.updateApplicationStatus(applicationId, status);
  }

  async filterApplications(status) {
    return await this.jobAppRepo.filterApplications(status);
  }
}

export default new JobApplicationService();
