import jobApplicationService from "../services/jobApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Assuming asyncHandler is a named export
import { AppError } from "../utils/errors.js";

class JobApplicationController {
    
    /**
     * @description Endpoint for a candidate to apply for a job.
     * @route POST /api/applications/apply
     */
    applyForJob = asyncHandler(async (req, res, next) => {
        console.log("Received Body: >>>>>>", req.body);

        const { jobId, candidateId, message, resumeUrl } = req.body;
        
        // Input validation
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

    /**
     * @description Retrieves all job applications (Admin/Recruiter view).
     * @route GET /api/applications
     */
    getAllApplications = asyncHandler(async (req, res) => {
        // Await the service function call.
        const applications = await jobApplicationService.getAllApplications();
        
        // Log the data for debugging purposes (optional)
        console.log(`Fetched ${applications.length} applications.`);

        // Send the response with status 200 (OK)
        res.status(200).json({
            success: true,
            total: applications.length, // Include the total count
            data: applications,         // Return the full array of applications
        });
    });

    /**
     * @description Updates the status of a specific job application.
     * @route PUT /api/applications/:applicationId/status
     */
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

    /**
     * @description Retrieves applications filtered by status.
     * @route GET /api/applications/status/:status
     */
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

// FIX: Added the missing closing brace and default export for the class instance.
export default new JobApplicationController();