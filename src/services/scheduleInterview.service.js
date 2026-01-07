import MongoscheduleInterviewRepository from "../repositories/implementations/mongoscheduleInterviewRepository.js";
import { AppError } from "../utils/errors.js";
import MongoUserRepository from "../repositories/implementations/mongoUserRepository.js";
import MongoTestRepository from "../repositories/implementations/mongoTestsRepository.js";
import MongoJobRoleRepository from "../repositories/implementations/mongoJobRoleRepository.js";
import { emailQueue } from "../queues/emailQueue.js";
class ScheduleInterviewService {
  constructor() {
    this.scheduleInterviewRepository = new MongoscheduleInterviewRepository();
    this.mongoUserRepository = new MongoUserRepository();
    this.jobRepository = new MongoJobRoleRepository();
  }

  async createInterview(data) {
    console.log(data);
    const candidate = await this.mongoUserRepository.findUserById(
      data.candidateId
    );
    const jobDetails = await this.jobRepository.findJobRoleById(data.jobId);
  
    console.log("Interviewer Email-->", data.interviewerEmail);
    emailQueue.add(
      "schedule-interview",
      {
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        interviewer: data.interviewerEmail,
        jobTitle: jobDetails.title,
        meetingLink: data.meetingLink,
        Timing: data.timing
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
    return await this.scheduleInterviewRepository.createInterview(data);
  }
  async getMyInterviews(candidateId) {
    return await this.scheduleInterviewRepository.getMyInterview(candidateId);
  }
  async getAllInterviews() {
    return await this.scheduleInterviewRepository.getAllInterviews();
  }

  async getInterviewById(id) {
    console.log("SERVICE HIT - Interview ID:", id);
    const interview = await this.scheduleInterviewRepository.getInterviewById(
      id
    );
    console.log("Interview found:", interview);
    if (!interview) {
      throw new AppError("Interview not found", 404);
    }
    return interview;
  }
  async getInterviewsByJobId(jobId) {
    const interview =
      await this.scheduleInterviewRepository.getInterviewsByJobId(jobId);
    if (!interview) {
      throw new AppError("Interview not found", 404);
    }
    return interview;
  }

  async updateInterviewStatus(id, status) {
    const updated =
      await this.scheduleInterviewRepository.updateInterviewStatus(id, status);
    if (!updated) {
      throw new AppError("Interview not found", 404);
    }
    return updated;
  }
  async deleteInterview(id) {
    const deleted = await this.scheduleInterviewRepository.deleteInterview(id);
  }
}

export default ScheduleInterviewService;
