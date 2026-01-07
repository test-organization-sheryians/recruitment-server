import ScheduledInterview from "../../models/scheduleInterview.model.js";
import { AppError } from "../../utils/errors.js";

export default class MongoScheduleInterviewRepository {
  async createInterview(data) {
    return ScheduledInterview.create(data);
  }
  
  async findByEmail(email) {
    return ScheduledInterview.findOne({ interviewerEmail: email }).lean();
  }
  
  async getMyInterview(candidateId) {
    return ScheduledInterview.find({ candidateId })
      .populate("jobId")
      .sort({ timing: 1 })
      .lean();
  }

 async getInterviewById(id) {
  return ScheduledInterview.findById(id)
  .populate("jobId candidateId")
  .sort({ timing: 1 })
  .lean();
 }

 async getInterviewsByJobId(jobId) {
  return ScheduledInterview.find({ jobId })
  .populate("candidateId")
  .sort({ timing: 1 })
  .lean();
 }


  async getAllInterviews() {
    return ScheduledInterview.find()
      .populate("jobId candidateId")
      .sort({ timing: 1 })
      .lean();
  }
  async updateInterviewStatus(id, status) {
    const interview = await ScheduledInterview.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!interview) {
      throw new AppError("Interview not found", 404);
    }
    return interview;
  }

  async deleteInterview(id) {
    const deleted = await ScheduledInterview.findByIdAndDelete(id);
    if (!deleted) {
      throw new AppError("Interview not found", 404);
    }
  }
}




