import JobRole from "../models/jobRole.model.js";
import { AppError } from "../utils/errors.js";
import MongoApplicationRespository from "../repositories/implementations/mongoJobApplication.js";

class JobApplicationService {
  constructor() {
    this.jobAppRepo = new MongoApplicationRespository();
  }

  async applyForJob({ jobId, candidateId, message, resumeFile }) {

    const isjobExist = await this.jobAppRepo.findByUserAndJob(candidateId, jobId);

    if (isjobExist) {
      throw new AppError("Already applied", 409);
    }
    const application = await this.jobAppRepo.createJobApplication({
      jobId,
      candidateId,
      message,
      resumeFile,
    });
    return application;
  }

  async updateApplicationStatus(candidateId, status) {
    const application = await this.jobAppRepo.updateApplicationStatus(
      candidateId,
      status
    );
    return application;
  }
}

export default new JobApplicationService();
