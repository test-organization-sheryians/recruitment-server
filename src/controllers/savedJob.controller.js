import savedJobService from "../services/savedJob.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class SavedJobController {


  saveJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.userId;

    const saved = await savedJobService.saveJob(userId, jobId);

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: saved,
    });
  });


  getSavedJobs = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await savedJobService.getSavedJobs(userId, page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });


  removeSavedJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.userId;

    await savedJobService.removeSavedJob(userId, jobId);

    res.status(200).json({
      success: true,
      message: "Saved job removed successfully",
    });
  });
}

export default new SavedJobController();
