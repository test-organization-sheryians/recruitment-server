import ReviewService from "../services/review.service.js";

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req, res, next) => {
    try {
      const review = await this.reviewService.createReview(req.body);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  getReviewsByUser = async (req, res, next) => {
    try {
      const reviews = await this.reviewService.getReviewsByUser(req.params.userId);
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req, res, next) => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const review = await this.reviewService.updateReview(req.params.id, req.body);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req, res, next) => {
    try {
      await this.reviewService.deleteReview(req.params.id);
      res.status(204).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  getAverageRating = async (req, res, next) => {
    try {
      const data = await this.reviewService.getAverageRating(req.params.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

export default new ReviewController();