import jobApplicationQuestionService from "../services/jobApplicationQuestionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

class jobApplicationQuestionController {

  createApplicationQuestion = asyncHandler(async (req, res, next) => {
    try {
      const jobId = req.params.id;
      const { questions } = req.body;
      if (!jobId) {
        throw new AppError("Job is required for creating jobApplication Questions",400);
      }
      if (!Array.isArray(questions) || questions.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one question is required" });
      }

      const Questions =
        await jobApplicationQuestionService.createApplicationQuestion(
          jobId,
          questions
        );

      return res.status(201).json({
        message: "Job application questions created successfully",
        count: Questions.length,
        data: Questions,
      });
    } catch (error) {
       next(error);
    }
  });

  getApplicationQuestion = asyncHandler(async (req, res, next) => {
    try {
      let jobId = req.params.id;
      if (!jobId) {
        res.status(404).json({ message: "Job id not found" });
      }
      const questions =
        await jobApplicationQuestionService.getApplicationQuestion(jobId);
      return res.json({
        success: true,
        data: questions,
        TotalQuestions: questions.length,
      });
    } catch (error) {
      next(error);

      
    }
  });

  updateApplicationQuestion = asyncHandler(async (req, res, next) => {
    try {
      let jobId = req.params.id;
      let {questionId,...questionData} = req.body;
      const UpdatedQuestion =
        await jobApplicationQuestionService.updateApplicationQuestion(
          jobId,
          questionId,
          questionData
        );
        return res.status(200).json({
        message: "Job application questions updated successfully",
        data: UpdatedQuestion,
      });
    } catch (error) {
      // console.log(error);
      
      next(error)
    }
  });

  deleteApplicationQuestion = asyncHandler(async (req, res, next) => {
    try {
      const jobId = req.params.id;
      const { questionId } = req.body;
      if (!jobId) {
        throw new AppError("Job id is required for deleting question", 400);
      }
      if (!questionId) {
        throw new AppError("questionId is required to delete a question", 400);
      }

      await jobApplicationQuestionService.deleteApplicationQuestion(jobId, questionId);

      return res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

}

export default new jobApplicationQuestionController();
