import AMongoReviewRepository from "../repositories/implementations/AMongoReviewRepository.js";
import { AppError } from "../utils/errors.js";

class AReviewService {
  constructor() {
    this.reviewRepository = new AMongoReviewRepository();
  }

  async createReview(data) {
    if (!data.productId || !data.userId) {
      throw new AppError("ProductId and UserId are required", 400);
    }

    return await this.reviewRepository.createReview(data);
  }

  async getReviewById(id) {
    const review = await this.reviewRepository.getReviewById(id);
    if (!review) throw new AppError("Review not found", 404);
    return review;
  }

  async getReviewsByProduct(productId) {
    return await this.reviewRepository.getReviewsByProduct(productId);
  }

  async updateReview(id, data) {
    const updated = await this.reviewRepository.updateReview(id, data);
    if (!updated) throw new AppError("Review not found", 404);
    return updated;
  }

  async deleteReview(id) {
    const deleted = await this.reviewRepository.deleteReview(id);
    if (!deleted) throw new AppError("Review not found", 404);
    return deleted;
  }
}

export default AReviewService;
