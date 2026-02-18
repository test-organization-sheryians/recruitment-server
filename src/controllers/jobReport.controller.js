import JobReportService from "../services/jobReport.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class JobReportController {
  constructor() {
    this.jobReportService = new JobReportService();
  }
  // POST /api/job-reports
  reportJob = asyncHandler(async (req, res) => {
    const { jobId, reason, description } = req.body;

    const report = await this.jobReportService.reportJob(req.userId, jobId, {
      reason,
      description,
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  });

  // GET /api/job-reports/me
  getMyReports = asyncHandler(async (req, res) => {
    const reports = await this.jobReportService.getMyReports(req.userId);

    res.status(200).json({
      success: true,
      data: reports,
    });
  });

  // GET /api/job-reports
  getAllReports = asyncHandler(async (req, res) => {
    const reports = await this.jobReportService.getAllReports(req.query);

    res.status(200).json({
      success: true,
      data: reports,
    });
  });

  // PUT /api/job-reports/:id
  updateReportStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await this.jobReportService.updateReportStatus(id, status);

    res.status(200).json({
      success: true,
      data: updated,
    });
  });

  // DELETE /api/job-reports/:id
  deleteReport = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await this.jobReportService.deleteReport(id);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  });
}

export default JobReportController;
