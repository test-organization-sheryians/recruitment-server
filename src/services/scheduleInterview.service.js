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

    if (!candidate) {
    throw new AppError("Candidate not found", 404);
  }
  
    console.log("Interviewer Email-->", data.interviewerEmail);
    try {
      await emailQueue.add(
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
    } catch (err) {
      console.error("Email queue failed:", err.message);
    }
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
  const interview = await this.scheduleInterviewRepository.getInterviewById(id);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

if (status === "Cancelled") {
  const candidateId =
    typeof interview.candidateId === "object"
      ? interview.candidateId._id
      : interview.candidateId;

  const jobId =
    typeof interview.jobId === "object"
      ? interview.jobId._id
      : interview.jobId;
  
  const interviewerEmail =
  interview.interviewerEmail ||
  interview.interviewer ||
  interview.interviewerId?.email ||
  interview.interviewer?.email ||
  null;

  const candidate =
    await this.mongoUserRepository.findUserById(candidateId);
  const jobDetails =
    await this.jobRepository.findJobRoleById(jobId);

  if (!candidate || !jobDetails || !interviewerEmail) {
    throw new AppError("Candidate or Job, interviewerEmail not found", 404);
  }

  try {
    await emailQueue.add(
      "cancel-interview",
      {
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobTitle: jobDetails.title,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
console.log("INTERVIEW OBJECT:", interview);

    await emailQueue.add(
      "cancel-interview-interviewer",
      {
        interviewer: interview.interviewerEmail,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobTitle: jobDetails.title,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  } catch (err) {
    console.error("Cancel interview email queue failed:", err.message);
  }
}

  const updated =
    await this.scheduleInterviewRepository.updateInterviewStatus(id, status);

  if (!updated) {
    throw new AppError("Interview not found", 404);
  }

  return updated;
}
  async deleteInterview(id) {
    const deleted = await this.scheduleInterviewRepository.deleteInterview(id);
    if (!deleted) {
      throw new AppError("Interview not found", 404);
    }
    return deleted;
  }
async rescheduleInterview(interviewId, data) {
  const interview =
    await this.scheduleInterviewRepository.getInterviewById(interviewId);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  
  const candidateId =
    typeof interview.candidateId === "object"
      ? interview.candidateId._id
      : interview.candidateId;


  const jobId =
    typeof interview.jobId === "object"
      ? interview.jobId._id
      : interview.jobId;

  const candidate = await this.mongoUserRepository.findUserById(candidateId);
  const jobDetails = await this.jobRepository.findJobRoleById(jobId);

  if (!candidate || !jobDetails) {
    throw new AppError("Candidate or Job not found", 404);
  }

  // Reschedule email notification
  try {
    await emailQueue.add(
      "reschedule-interview",
      {
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        interviewer: data.interviewerEmail,
        jobTitle: jobDetails.title,
        meetingLink: data.meetingLink,
        Timing: data.timing,
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
  } catch (err) {
    console.error("Reschedule email queue failed:", err.message);
  }

  
  return await this.scheduleInterviewRepository.rescheduleInterview(
    interviewId,
    {
      interviewerEmail: data.interviewerEmail,
      meetingLink: data.meetingLink,
      timing: data.timing,
      // keep interview status as Scheduled; add isRescheduled flag for UI only
      status: data.status || "Scheduled",
      isRescheduled: true,
    }
  );
}

}

export default ScheduleInterviewService;
