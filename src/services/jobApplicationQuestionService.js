import mongoose from "mongoose";
import mongoJobApplicationQuesRepository from "../repositories/implementations/mongoJobApplicationQuesRepository.js";
import jobRoleModel from "../models/jobRole.model.js";
import { AppError } from "../utils/errors.js";

class jobApplicationQuestionService {
  constructor() {
    this.jobApplicationQuesRepo = new mongoJobApplicationQuesRepository();
  }

  async createApplicationQuestion(jobid, questions) {
    const jobExists = await jobRoleModel.findById(jobid);
    // if (!jobExists) {
    //   throw new AppError("Job not found for creating questions", 400);
    // }
    return await this.jobApplicationQuesRepo.createApplicationQuestion(
      jobid,
      questions
    );
  }

  async getApplicationQuestion(jobId) {
    const jobExists = await jobRoleModel.findById(jobId);
    // if (!jobExists) {
    //   throw new AppError("Job not found", 404);
    // }
    return await this.jobApplicationQuesRepo.getApplicationQuestion(jobId);
  }

  async updateApplicationQuestion(jobId,
          questionId,
          questionData) {
    return await this.jobApplicationQuesRepo.updateApplicationQuestion(
      jobId,
          questionId,
          questionData
    );
  }

  async deleteApplicationQuestion(jobId, questionId) {
    const jobExists = await jobRoleModel.findById(jobId);
    if (!jobExists) {
      throw new AppError("Job not found for deleting question", 400);
    }
    return await this.jobApplicationQuesRepo.deleteApplicationQuestion(
      jobId,
      questionId
    );
  }


}

export default new jobApplicationQuestionService();

