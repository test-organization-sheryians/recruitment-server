import { asyncHandler } from "../utils/asyncHandler.js";
import feedbackService from "../services/feedback.service.js";


class FeedbackController {

  createFeedback = asyncHandler(async (req, res) => {

    const feedback =
      await feedbackService.createFeedback(req.body);

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback,
    });

  });

  getAllFeedbacks = asyncHandler(async (req, res) => {

    const feedbacks =
      await feedbackService.getAllFeedbacks();

    res.status(200).json({
      success: true,
      data: feedbacks,
    });

  });

  getFeedbackByCandidate = asyncHandler(async (req, res) => {

    const { candidateId } = req.params;

    const feedbacks =
      await feedbackService.getFeedbackByCandidate(
        candidateId
      );

    res.status(200).json({
      success: true,
      data: feedbacks,
    });

  });

  deleteFeedback = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await feedbackService.deleteFeedback(id);

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });

  });

}

export default new FeedbackController();