import jobApplicationService from "../services/jobApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

class JobApplicationController {
 applyForJob = asyncHandler(async (req, res, next) => {
  console.log("Received Body: >>>>>>", req.body);

  const {jobId ,  candidateId , message , resumeUrl} = req.body;
 
  // const { jobId } = req.body;           // <-- keep this as jobId only
  // const candidateId = req.body;
  // const { message, resumeUrl } = req.body;

  if (!resumeUrl) throw new AppError("Resume URL is required", 400);

  const application = await jobApplicationService.applyForJob({
     jobId,      
    candidateId,
    message,
    resumeUrl,
  });

  console.log( "application >>>>>" ,application);

  res.status(201).json({
    success: true,
    message: "Application submitted successfully!",
    data: application,
  });
});
  getAllApplications = asyncHandler(async (req, res) => {
    const applications = await jobApplicationService.getAllApplications();
    console.log(applications)
    res.status(200).json({
      success: true,
      total: applications.length,
      data: applications,
    });
  });



  updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new AppError("Status is required", 400);
    }

    const updated = await jobApplicationService.updateApplicationStatus(
      applicationId,
      status
    );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: updated,
    });
  });

  filterApplications = asyncHandler(async (req, res) => {
    const { status } = req.params;

    const applications = await jobApplicationService.filterApplications(status);
console.log("here is >>>>" ,applications)
    res.status(200).json({
      success: true,
      total: applications.length,
      data: applications,
    });
  });
}

export default new JobApplicationController();
