import IReviewRepository from "../contracts/IReviewRepository.js";
import Review from "../../models/review.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoReviewRepository extends IReviewRepository {

  async createReview(reviewData) {
    try {
      const review = new Review(reviewData);
      return await review.save();
    } catch (error) {
      throw new AppError("Failed to create review", 500);
    }
  }

  async findReviewById(id) {
    try {
      return await Review.findById(id);
    } catch (error) {
      throw new AppError("Failed to find review", 500);
    }
  }

  // async findReviewsByUser(userId) {
  //   try {
  //     return await Review.find({ userId: userId })
  //       .populate("reviewerId", "name email")
  //       .sort({ createdAt: -1 });
  //   } catch (error) {
  //     throw new AppError("Failed to fetch reviews", 500);
  //   }
  // }

  async findReviewsByUser(userId) {
  try {
    return await Review.find({ userId: userId })
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new AppError("Failed to fetch reviews", 500);
  }
}

  async updateReview(id, reviewData) {
    try {
      return await Review.findByIdAndUpdate(id, reviewData, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      throw new AppError("Failed to update review", 500);
    }
  }

  async deleteReview(id) {
    try {
      return await Review.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete review", 500);
    }
  }

  // async getAverageRating(userId) {
  //   try {
  //     const result = await Review.aggregate([
  //       { $match: { targetUserId: new mongoose.Types.ObjectId(userId) } },
  //       {
  //         $group: {
  //           _id: "$targetUserId",
  //           avgRating: { $avg: "$rating" },
  //           totalReviews: { $sum: 1 }
  //         }
  //       }
  //     ]);

  //     return result[0] || { avgRating: 0, totalReviews: 0 };
  //   } catch (error) {
  //     throw new AppError("Failed to calculate rating", 500);
  //   }
  // }
  async getAverageRating(userId) {
  try {
    const result = await Review.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$userId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { avgRating: 0, totalReviews: 0 };
  } catch (error) {
    throw new AppError("Failed to calculate rating", 500);
  }
}
}

export default MongoReviewRepository;