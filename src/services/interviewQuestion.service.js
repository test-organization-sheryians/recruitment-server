import MongoInterviewQuestionRepository from "../repositories/implementations/mongoInterviewQuestionRepository.js";
import { AppError } from "../utils/errors.js";

class InterviewQuestionService {
  constructor() {
    this.questionRepository = new MongoInterviewQuestionRepository();
  }

  async createQuestion(questionData) {
    return await this.questionRepository.createQuestion(questionData);
  }

  async getAllQuestions() {
    return await this.questionRepository.findAllQuestions();
  }

  async getQuestionById(id) {
    const question = await this.questionRepository.findQuestionById(id);

    if (!question) {
      throw new AppError("Question not found", 404);
    }

    return question;
  }

  async updateQuestion(id, questionData) {
    const question = await this.questionRepository.updateQuestion(
      id,
      questionData
    );

    if (!question) {
      throw new AppError("Question not found", 404);
    }

    return question;
  }

  async deleteQuestion(id) {
    const question = await this.questionRepository.deleteQuestion(id);

    if (!question) {
      throw new AppError("Question not found", 404);
    }

    return question;
  }
}

export default InterviewQuestionService;