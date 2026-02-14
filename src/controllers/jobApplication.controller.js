import jobApplicationService from "../services/jobApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

class JobApplicationController {

    applyForJob = asyncHandler(async (req, res, next) => {
        const { jobId, message, resumeUrl } = req.body;
        const candidateId = req.userId;

        if (!resumeUrl) throw new AppError("Resume URL is required", 400);


        const response = await jobApplicationService.applyForJob({
            jobId,
            candidateId,
            message,
            resumeUrl,
        });
        res.status(201).json(response);
    });

    bulkUpdateApplicationStatus = asyncHandler(async (req,res)=>{
        const {applicationIds, status} = req.body;

        if(!status){
            throw new AppError("Status is required", 400);
        }
        
        if (!applicationIds || applicationIds.length === 0) {
        throw new AppError("Application IDs are required", 400);
        }

        const bulkUpdate = await jobApplicationService.bulkUpdateApplicationStatus(
            applicationIds,
            status
        );
        res.status(200).json({
            success: true,
            message:"Bulk Application Status updated successfully",
            data: bulkUpdate,
        });
    });

    getAllApplications = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await jobApplicationService.getAllApplications(page, limit);

        res.status(200).json({
            success: true,
            pagination: result.pagination,
            data: result.data,
        });
    });

    updateApplicationStatus = asyncHandler(async (req, res) => {
        const { applicationId } = req.body;
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await jobApplicationService.filterApplications(status, page, limit);

        res.status(200).json({
            success: true,
            pagination: result.pagination,
            data: result.data,
        });
    });

    // Get Candidate Applied job applications
    getCandidateAllApplications = asyncHandler(async (req, res) => {
        const candidateId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await jobApplicationService.getCandidateAllApplications(candidateId, page, limit);

        res.status(200).json({
            success: true,
            pagination: result.pagination,
            data: result.data,
        });
    })
// Get Applicants by Job ID
  getApplicantsByJobId = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const result = await jobApplicationService.getApplicantsByJobId(jobId);

  res.status(200).json({
    success: true,
    applicants: result.applicants,
  });
});

    getShortlistedCount = asyncHandler(async (req, res) => {
        const result = await jobApplicationService.getShortlistedCounts();
        res.status(200).json({
            success: true,
            data: result,
        });
    });
}

export default new JobApplicationController();
