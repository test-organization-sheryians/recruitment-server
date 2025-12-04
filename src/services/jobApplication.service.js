import JobRole from "../models/jobRole.model.js";
import { AppError } from "../utils/errors.js";
import MongoApplicationRespository from "../repositories/implementations/mongoJobApplication.js";
import MongoCandidateProfileRepository from "../repositories/implementations/mongoCandidateProfileRepository.js";
import MongoJobRoleRepository from "../repositories/implementations/mongoJobRoleRepository.js";
import { sendWelcomeEmail } from "./sendMail.js";
import logger from "../utils/logger.js";
import { emailQueue } from "../queues/emailQueue.js";

class JobApplicationService {
  constructor() {
    this.jobAppRepo = new MongoApplicationRespository();
    this.candidateRepo = new MongoCandidateProfileRepository();
    this.jobRoleReop = new MongoJobRoleRepository();
  }

  async applyForJob({ jobId, candidateId, message, resumeUrl }) {
    const candidateDetails = await this.candidateRepo.findProfileByUserId(
      candidateId
    );
    
    if (!candidateDetails) {
       throw new AppError("Please create your profile first", 401);
    }
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

    // const candidateDetails = await this.candidateRepo.findProfileByUserId(
    //   candidateId
    // );
    const jobDetails = await this.jobRoleReop.findJobRoleById(jobId);
      console.log(candidateDetails , "this is candidate details ")
//    try {
//   await sendWelcomeEmail({
//     to: candidateDetails?.user?.email,
//     name: candidateDetails?.user?.firstName,
//     jobTitle: jobDetails.title,
//     appliedAt: application.createdAt,
//     applicationId: application._id,
//   });
// } catch (error) {
//   // Fail silently — don't break the application flow
//   logger.warn("Welcome email failed but application was created successfully", {
//     email: candidateDetails?.user?.email,
//     applicationId: application._id,
//   });
// }

try {
  // ADD JOB TO BULLMQ QUEUE — NOT SEND EMAIL DIRECTLY
  await emailQueue.add(
    "welcome-candidate",  
    {
      to: candidateDetails?.user?.email,
      name: candidateDetails?.user?.firstName || "Candidate",
      jobTitle: jobDetails.title,
      appliedAt: application.createdAt,
      applicationId: application._id.toString(),
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  logger.info(`Welcome email job queued for ${candidateDetails?.user?.email}`, {
    applicationId: application._id,
  });
} catch (error) {
  logger.warn("Failed to queue welcome email", {
    email: candidateDetails?.user?.email,
    applicationId: application._id,
    error: error.message,
  });
}
    
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
