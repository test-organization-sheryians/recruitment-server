import jobApplication from "../models/jobApplication.model.js";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";

export const applyForJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const candidateId = req.userId;
  const { message } = req.body;
  const resumeFile = req.file;

  if (!resumeFile) {
    throw new AppError("Resume file is required.", 400);
  }

  const job = await JobRole.findById(jobId);
  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  if (new Date(job.expiry) < new Date()) {
    throw new AppError("Job has expired.", 400);
  }

  const existingApplication = await jobApplication.findOne({
    jobId,
    candidateId,
  });

  if (existingApplication) {
    throw new AppError("You have already applied for this job.", 400);
  }

  const application = await jobApplication.create({
    jobId,
    candidateId,
    message,
    resumeUrl: resumeFile.path || resumeFile.url,
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully!",
    data: application,
  });
});
