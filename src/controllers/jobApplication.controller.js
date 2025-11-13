import jobApplicationService from "../services/jobApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

export const applyForJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const candidateId = req.userId;
  const { message } = req.body;
  const resumeFile = req.file;

  const application = await jobApplicationService.applyForJob({
    jobId,
    candidateId,
    message,
    resumeFile,
  });

  if (!application) {
    return next(new AppError("Application not found", 404));
  }

  res.status(201).json({
    success: true,
    message: "Application submitted successfully!",
    data: application,
  });
});
