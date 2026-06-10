import InterviewQuestionService from "../services/interviewQuestion.service.js";

class InterviewQuestionController {
  constructor() {
    this.questionService = new InterviewQuestionService();
  }

  createQuestion = async (req, res, next) => {
    try {
      const question = await this.questionService.createQuestion(req.body);

      res.status(201).json({
        success: true,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllQuestions = async (req, res, next) => {
    try {
      const questions = await this.questionService.getAllQuestions();

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  };

  getQuestionById = async (req, res, next) => {
    try {
      const question = await this.questionService.getQuestionById(req.params.id);

      res.status(200).json({
        success: true,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  };

  updateQuestion = async (req, res, next) => {
    try {
      const question = await this.questionService.updateQuestion(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteQuestion = async (req, res, next) => {
    try {
      await this.questionService.deleteQuestion(req.params.id);

      res.status(204).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new InterviewQuestionController();