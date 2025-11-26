import jobApplicationService from "../services/jobApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { AppError } from "../utils/errors.js";

class JobApplicationController {
    
    applyForJob = asyncHandler(async (req, res, next) => {
        const { jobId, message, resumeUrl } = req.body;
        const  candidateId  = req.userId;
        
        if (!resumeUrl) throw new AppError("Resume URL is required", 400);

        await jobApplicationService.applyForJob({
            jobId,
            candidateId,
            message,
            resumeUrl,
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully!",
        });
    });

    getAllApplications = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        const applications = await jobApplicationService.getAllApplications(page, limit);
        
        res.status(200).json({
            success: true,
            total: applications.length, 
            data: applications,         
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
        const applications = await jobApplicationService.filterApplications(status);
        
        res.status(200).json({
            success: true,
            total: applications.length,
            data: applications,
        });
    });
}

export default new JobApplicationController();
