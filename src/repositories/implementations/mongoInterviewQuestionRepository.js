import IInterviewQuestionRepository from "../contracts/IInterviewQuestionRepository.js";
import InterviewQuestion from "../../models/interviewQuestion.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoInterviewQuestionRepository extends IInterviewQuestionRepository {

  async createQuestion(questionData) {
    try {
      const question = new InterviewQuestion(questionData);
      return await question.save();
    } catch (error) {
      throw new AppError("Failed to create interview question", 500);
    }
  }

  async findQuestionById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Question ID", 400);
    }

    try {
      return await InterviewQuestion.findById(id);
    } catch (error) {
      throw new AppError("Failed to find question", 500);
    }
  }

  async findAllQuestions() {
    try {
      return await InterviewQuestion.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new AppError("Failed to fetch questions", 500);
    }
  }

  async updateQuestion(id, questionData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Question ID", 400);
    }

    try {
      return await InterviewQuestion.findByIdAndUpdate(
        id,
        questionData,
        {
          new: true,
          runValidators: true,
        }
      );
    } catch (error) {
      throw new AppError("Failed to update question", 500);
    }
  }

  async deleteQuestion(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Question ID", 400);
    }

    try {
      return await InterviewQuestion.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete question", 500);
    }
  }
}

export default MongoInterviewQuestionRepository;