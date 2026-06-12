import MongoFeedbackRepository from "../repositories/implementations/mongoFeedbackRepository.js";
import { AppError } from "../utils/errors.js";

class FeedbackService {
  constructor(repo) {
    this.feedbackRepo = repo;
  }

  async createFeedback(data) {
    const { candidateId, interviewerId, rating, comment } = data;

    if (!candidateId || !interviewerId || rating === undefined || !comment) {
      throw new AppError("All fields are required", 400);
    }

    return await this.feedbackRepo.createFeedback(data);

  }

  async getAllFeedbacks() {
    return await this.feedbackRepo.getAllFeedbacks();
  }

  async getFeedbackByCandidate(candidateId) {
    return await this.feedbackRepo.getFeedbackByCandidate(candidateId);
  }

  async deleteFeedback(feedbackId) {
    const deleted = await this.feedbackRepo.deleteFeedback(feedbackId);

    if (!deleted) {
      throw new AppError("Feedback not found", 404);
    }

    return deleted;
  }
}

const feedbackService = new FeedbackService(new MongoFeedbackRepository());

export default feedbackService;
