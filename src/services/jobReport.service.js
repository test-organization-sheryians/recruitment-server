import MongoJobReportRepository from "../repositories/implementations/mongoJobReportRepository.js";
import { AppError } from "../utils/errors.js";

const jobReportRepo = new MongoJobReportRepository();

class JobReportService {
  async reportJob(userId, jobId, data) {
    const existingReport = await jobReportRepo.findByUserAndJob(userId, jobId);
    if (existingReport) {
      throw new AppError("You have already reported this job.", 409);
    }
    return await jobReportRepo.create({ userId, jobId, ...data });
  }

  async getMyReports(userId) {
    return await jobReportRepo.findByUser(userId);
  }
  async getAllReports(filter = {}) {
    return await jobReportRepo.findAll(filter);
  }
  async updateReportStatus(reportId, status) {
    const updated = await jobReportRepo.updateStatus(reportId, status);
    if (!updated) {
      throw new AppError("Report not found", 404);
    }
    return updated;
  }

  async deleteReport(reportId) {
    const deleted = await jobReportRepo.deleteById(reportId);
    if (!deleted) {
      throw new AppError("Report not found", 404);
    }
    return deleted;
  }
}

export default JobReportService;
