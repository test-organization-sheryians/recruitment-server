import MongoReviewRepository from "../repositories/implementations/mongoReviewRepository.js";
import { AppError } from "../utils/errors.js";

class ReviewService {
  constructor() {
    this.reviewRepository = new MongoReviewRepository();
  }

  async createReview(reviewData) {
    return await this.reviewRepository.createReview(reviewData);
  }

  async getReviewsByUser(userId) {
    return await this.reviewRepository.findReviewsByUser(userId);
  }

  async getReviewById(id) {
    const review = await this.reviewRepository.findReviewById(id);
    if (!review) {
      throw new AppError("Review not found", 404);
    }
    return review;
  }

  async updateReview(id, reviewData) {
    const review = await this.reviewRepository.updateReview(id, reviewData);
    if (!review) {
      throw new AppError("Review not found", 404);
    }
    return review;
  }

  async deleteReview(id) {
    const review = await this.reviewRepository.deleteReview(id);
    if (!review) {
      throw new AppError("Review not found", 404);
    }
    return review;
  }

  async getAverageRating(userId) {
    return await this.reviewRepository.getAverageRating(userId);
  }
}

export default ReviewService;