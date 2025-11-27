import JobRole from "../models/jobRole.model.js";
import { AppError } from "../utils/errors.js";
import MongoApplicationRespository from "../repositories/implementations/mongoJobApplication.js";
import MongoCandidateProfileRepository from "../repositories/implementations/mongoCandidateProfileRepository.js";
import MongoJobRoleRepository from "../repositories/implementations/mongoJobRoleRepository.js";
import { emailQueue } from "../queues/emailQueue.js";

class JobApplicationService {
  constructor() {
    this.jobAppRepo = new MongoApplicationRespository();
    this.candidateRepo = new MongoCandidateProfileRepository();
    this.jobRoleReop = new MongoJobRoleRepository();
  }

  async applyForJob({ jobId, candidateId, message, resumeUrl }) {
    const job = await JobRole.findById(jobId);
    if (!job) throw new AppError("Job not found", 404);

    if (new Date(job.expiry) < new Date()) {
      throw new AppError("Job has expired", 400);
    }

    const exists = await this.jobAppRepo.findByUserAndJob(candidateId, jobId);
    if (exists) throw new AppError("Already applied for this job", 409);

    const application = await this.jobAppRepo.createJobApplication({
      jobId,
      candidateId,
      message,
      resumeUrl,
    });

    const candidateDetails = await this.candidateRepo.findProfileByUserId(
      candidateId
    );
    const jobDetails = await this.jobRoleReop.findJobRoleById(jobId);

    emailQueue
      .add(
        "welcome-candidate",
        {
          to: candidateDetails?.user?.email,
          name: candidateDetails?.user?.firstName,
          jobTitle: jobDetails.title,
          appliedAt: application.createdAt,
          applicationId: application._id,
        },
        {
          jobId: `welcome-${application._id}`,
        }
      )
      .catch((err) => {
        logger.error("Failed to queue welcome email:", err);
      });

    return {
      success: true,
      message: "Application submitted successfully!",
      application,
    };
  }




  async getAllApplications() {
    return await this.jobAppRepo.getAllApplications();
  }

  async updateApplicationStatus(applicationId, status) {
    return await this.jobAppRepo.updateApplicationStatus(applicationId, status);
  }

  async filterApplications(status) {
    return await this.jobAppRepo.filterApplications(status);
  }
}

export default new JobApplicationService();
