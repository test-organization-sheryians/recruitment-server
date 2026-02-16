import AReviewService from "../services/AReview.service.js";

class AReviewController {
  constructor() {
    this.reviewService = new AReviewService();
  }

  createReview = async (req, res, next) => {
    try {
      const review = await this.reviewService.createReview({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  };

  getReviewById = async (req, res, next) => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      res.json(review);
    } catch (err) {
      next(err);
    }
  };

  getReviewsByProduct = async (req, res, next) => {
    try {
      const reviews = await this.reviewService.getReviewsByProduct(
        req.params.productId
      );
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const review = await this.reviewService.updateReview(
        req.params.id,
        req.body
      );
      res.json(review);
    } catch (err) {
      next(err);
    }
  };

  deleteReview = async (req, res, next) => {
    try {
      await this.reviewService.deleteReview(req.params.id);
      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}

export default AReviewController;
