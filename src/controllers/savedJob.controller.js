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

    const savedJobs = await savedJobService.getSavedJobs(userId);

    res.status(200).json({
      success: true,
      total: savedJobs.length,
      data: savedJobs,
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
