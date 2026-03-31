import JobApplicationQuestions from "../../models/JobApplicationQuestions.js";
import { AppError } from "../../utils/errors.js";
import { IJobApplicationQuestion } from "../contracts/IJobApplicationQuestion.js";

class MongoJobApplicationQuesRepository extends IJobApplicationQuestion {

  // Create or append questions for a job
  async createApplicationQuestion(jobId, questions) {
    try {
      const existingDoc = await JobApplicationQuestions.findOne({ jobId });
      const existingQuestions = existingDoc?.questions || [];

      const maxExistingOrder =
        existingQuestions.length > 0
          ? Math.max(...existingQuestions.map(q => q.order || 0))
          : 0;

      const formattedQuestions = questions.map((q, index) => ({
        ...q,
        order: q.order ?? maxExistingOrder + index + 1,
      }));

      const result = await JobApplicationQuestions.findOneAndUpdate(
        { jobId },
        { $push: { questions: { $each: formattedQuestions } } },
        { new: true, upsert: true, runValidators: true }
      );

      return result.questions;
    } catch (error) {
      console.error(error);
      throw new AppError("Error in creating job application questions", 500);
    }
  }

  async getApplicationQuestion(jobId) {
    try {
      const doc = await JobApplicationQuestions.findOne({ jobId });
      if (!doc) return [];

      return doc.questions.sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new AppError("Error in fetching job application questions", 500);
    }
  }

  async updateApplicationQuestion(jobId, questionId, data) {
    try {
      const updateObj = {};

      Object.keys(data).forEach(key => {
        if (key !== "_id") {
          updateObj[`questions.$.${key}`] = data[key];
        }
      });

      const updatedDoc = await JobApplicationQuestions.findOneAndUpdate(
        { jobId, "questions._id": questionId },
        { $set: updateObj },
        { new: true, runValidators: true }
      );

      if (updatedDoc) {
        return updatedDoc.questions.id(questionId);
      }

      // If question not found → add as new
      const parentDoc = await JobApplicationQuestions.findOne({ jobId });

      if (!parentDoc) {
        throw new AppError("Job Questions document not found", 404);
      }

      const nextOrder =
        parentDoc.questions.length > 0
          ? Math.max(...parentDoc.questions.map(q => q.order || 0)) + 1
          : 1;

      const newQuestion = { ...data, order: nextOrder };

      parentDoc.questions.push(newQuestion);
      await parentDoc.save();

      return parentDoc.questions[parentDoc.questions.length - 1];
    } catch (error) {
      console.error(error);
      throw new AppError(error.message || "Error in updating question", 500);
    }
  }

  async deleteApplicationQuestion(jobId, questionId) {
    try {
      const updated = await JobApplicationQuestions.findOneAndUpdate(
        { jobId },
        { $pull: { questions: { _id: questionId } } },
        { new: true }
      );

      if (!updated) {
        throw new AppError("Job Questions document not found", 404);
      }

      return updated;
    } catch (error) {
      throw new AppError("Error in deleting question", 500);
    }
  }
}

export default MongoJobApplicationQuesRepository;
