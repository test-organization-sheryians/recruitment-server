import JobRole from "../models/jobRole.model.js";
import { AppError } from "../utils/errors.js";
import MongoApplicationRespository from "../repositories/implementations/mongoJobApplication.js";

class JobApplicationService {
  constructor() {
    this.jobAppRepo = new MongoApplicationRespository();
  }

<<<<<<< HEAD
  async applyForJob({ jobId, candidateId, message, resumeFile }) {

    const isjobExist = await this.jobAppRepo.findByUserAndJob(candidateId, jobId);

    if (isjobExist) {
      throw new AppError("Already applied", 409);
=======
  async applyForJob({ jobId, candidateId, message, resumeUrl }) {
    const job = await JobRole.findById(jobId);
    if (!job) throw new AppError("Job not found", 404);

    if (new Date(job.expiry) < new Date()) {
      throw new AppError("Job has expired", 400);
>>>>>>> b2141d8 (feat:implement the all routes and controller)
    }

    const exists = await this.jobAppRepo.findByUserAndJob(candidateId, jobId);
    if (exists) throw new AppError("Already applied", 409);
    const application = await this.jobAppRepo.createJobApplication({
      jobId,
      candidateId,
      message,
      resumeUrl,
    });
    return application;
  }

  async updateApplicationStatus(applicationId, status) {
    return await this.jobAppRepo.updateApplicationStatus(applicationId, status);
  }

  async getAllApplications() {
    return await this.jobAppRepo.getAllApplications();
  }
  async filterApplications(status) {
    return await this.jobAppRepo.filterApplications(status);
  }
}

export default new JobApplicationService();
