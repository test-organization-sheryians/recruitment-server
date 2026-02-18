import IJobReportRepository from "../contracts/IjobReportRepository.js";
import { JobReport } from "../../models/RjobReport.model.js";
import { AppError } from "../../utils/errors.js";

class MongoJobReportRepository extends IJobReportRepository {
  async create(reportData) {
    try {
      const report = new JobReport(reportData);
      return await report.save();
    } catch (error) {
      throw new AppError(`Failed to create job report: ${error.message}`, 500);
    }
  }

  async findByUserAndJob(userId, jobId) {
    try {
      return await JobReport.findOne({ userId, jobId });
    } catch (error) {
      throw new AppError(
        `Failed to find report by user and job: ${error.message}`,
        500,
      );
    }
  }

  async findByUser(userId) {
    try {
      return await JobReport.find({ userId });
    } catch (error) {
      throw new AppError(`Failed to fetch user reports: ${error.message}`, 500);
    }
  }

  async findAll(filter = {}) {
    try {
      return await JobReport.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new AppError(`Failed to fetch all reports: ${error.message}`, 500);
    }
  }

  async findById(reportId) {
    try {
      return await JobReport.findById(reportId);
    } catch (error) {
      throw new AppError(`Failed to find report: ${error.message}`, 500);
    }
  }

  async updateStatus(reportId, status) {
    try {
      return await JobReport.findByIdAndUpdate(
        reportId,
        { status },
        { new: true, runValidators: true },
      );
    } catch (error) {
      throw new AppError(
        `Failed to update report status: ${error.message}`,
        500,
      );
    }
  }

  async deleteById(reportId) {
    try {
      return await JobReport.findByIdAndDelete(reportId);
    } catch (error) {
      throw new AppError(`Failed to delete report: ${error.message}`, 500);
    }
  }
}

export default MongoJobReportRepository;
