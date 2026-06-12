import Feedback from "../../models/feedback.model.js";
import { AppError } from "../../utils/errors.js";
import IFeedbackRepository from "../contracts/IFeedbackRepository.js";

class MongoFeedbackRepository extends IFeedbackRepository {
  async createFeedback(data) {
    try {
      return await Feedback.create(data);
    } catch (error) {
      if(error.name === "ValidationError"){
        throw new AppError(
          error.message , 
          400
        );
      }

      throw new AppError(
        "Unable to create feedback",
        500
      );
    }
  }

  async getAllFeedbacks() {
    try {
      return await Feedback.find()
        .populate("candidateId", "name email")
        .populate("interviewerId", "name email");
    } catch (error) {
      throw new AppError("Unable to fetch feedbacks", 500);
    }
  }

  async getFeedbackByCandidate(candidateId) {
    try {
      return await Feedback.find({
        candidateId,
      });
    } catch (error) {
      throw new AppError("Unable to fetch feedback", 500);
    }
  }

  async deleteFeedback(feedbackId) {
    try {
      return await Feedback.findByIdAndDelete(feedbackId);
    } catch (error) {
      throw new AppError("Unable to delete feedback", 500);
    }
  }
}

export default MongoFeedbackRepository;
