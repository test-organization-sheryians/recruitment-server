import mongoose from "mongoose";
import AReviewRepository from "../contracts/AReviewRepository.js";
import { AReview } from "../../models/AReview.model.js";
import { AppError } from "../../utils/errors.js";

class AMongoReviewRepository extends AReviewRepository {
  async createReview(data) {
    try {
      const review = new AReview(data);
      return await review.save();
    } catch (error) {
      throw new AppError(`Failed to create review: ${error.message}`, 500);
    }
  }

  async getReviewById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid review id", 400);
    }

    return await AReview.findById(id)
      .populate("userId", "firstName lastName")
      .populate("productId", "name price");
  }

  async getReviewsByProduct(productId) {
    return await AReview.find({
      productId,
      isActive: true,
    })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });
  }

  async updateReview(id, data) {
    return await AReview.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async deleteReview(id) {
    return await AReview.findByIdAndDelete(id);
  }
}

export default AMongoReviewRepository;
