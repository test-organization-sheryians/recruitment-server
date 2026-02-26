import CertificateService from "../services/certificate.service.js";
import { certificateQueue } from "../queues/certificateQueue.js";
import logger from "../utils/logger.js";
import xlsx from "xlsx";

class CertificateController {
  constructor() {
    this.certificateService = new CertificateService();
  }

  // ─── Existing CRUD Methods (unchanged) ──────────────────────────────────

  create = async (req, res, next) => {
    try {
      const data = req.body;
      const certificate = await this.certificateService.createCertificate(data);
      return res.status(201).json({
        success: true,
        data: certificate,
        message: "Certificate created successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  listAll = async (req, res, next) => {
    try {
      const result = await this.certificateService.getAllCertificates();
      return res.status(200).json({
        success: true,
        data: result,
        message: "Certificates fetched successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const { id } = req.params;
      const certificate = await this.certificateService.getCertificateById(id);
      return res.status(200).json({
        success: true,
        data: certificate,
        message: "Certificate fetched successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedCertificate =
        await this.certificateService.updateCertificate(id, updateData);
      return res.status(200).json({
        success: true,
        data: updatedCertificate,
        message: "Certificate updated successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.certificateService.deleteCertificate(id);
      return res.status(200).json({
        success: true,
        message: "Certificate deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  // ─── NEW: Bulk Certificate Generation ───────────────────────────────────

  /**
   * POST /api/certificates/generate-bulk
   * Admin triggers bulk certificate generation
   *
   * Body: {
   *   students: [
   *     {
   *       name: "Harsh Sharma",
   *       email: "harsh@example.com",
   *       internshipRole: "Frontend Developer",
   *       organizationName: "Sheryians Coding School",  ← optional
   *       startDate: "01 Jan 2025",
   *       endDate: "30 Jun 2025"
   *     }
   *   ]
   * }
   */
  generateBulk = async (req, res, next) => {
    try {
      // ── Step 1: Check file uploaded ──────────────────────────────────────
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an Excel file (.xlsx)",
        });
      }

      // ── Step 2: Parse Excel from buffer (memoryStorage — no local file) ──
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet);

      if (!rows || rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Excel file is empty or has no data rows",
        });
      }

      // ── Step 3: Map Excel rows → students array ───────────────────────────
      // Expected Excel columns: Name, Email, InternshipRole, StartDate, EndDate
      const students = rows.map((row) => ({
        name: row["Name"]?.toString().trim(),
        email: row["Email"]?.toString().trim(),
        internshipRole: row["InternshipRole"]?.toString().trim(),
        startDate: row["StartDate"]?.toString().trim(),
        endDate: row["EndDate"]?.toString().trim(),
        organizationName:
          row["OrganizationName"]?.toString().trim() ||
          "Sheryians Coding School",
      }));

      // ── Step 4: Validate all rows have required fields ────────────────────
      const requiredFields = [
        "name",
        "email",
        "internshipRole",
        "startDate",
        "endDate",
      ];
      const invalidStudents = students.reduce((acc, student, index) => {
        const missing = requiredFields.filter((f) => !student[f]);
        if (missing.length > 0)
          acc.push({
            row: index + 2,
            name: student.name || "Unknown",
            missing,
          });
        return acc;
      }, []);

      if (invalidStudents.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some rows in Excel have missing required fields",
          invalidStudents,
        });
      }

      // ── Step 5: Add job to queue — returns instantly ──────────────────────
      const job = await certificateQueue.add("bulk-certificate-generation", {
        students,
        triggeredBy: req.userId,
        triggeredAt: new Date().toISOString(),
      });

      logger.info(
        `Certificate job ${job.id} queued by admin ${req.userId} for ${students.length} students`,
      );

      return res.status(202).json({
        success: true,
        message: `Certificate generation started for ${students.length} student(s). Emails will be sent once ready.`,
        jobId: job.id,
        totalStudents: students.length,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/certificates/job-status/:jobId
   * Admin polls this to check bulk generation progress
   */
  getJobStatus = async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const job = await certificateQueue.getJob(jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      const state = await job.getState(); // waiting | active | completed | failed

      return res.status(200).json({
        success: true,
        data: {
          jobId: job.id,
          state,
          progress: `${job.progress || 0}%`,
          triggeredAt: job.data.triggeredAt,
          totalStudents: job.data.students?.length,
          result: job.returnvalue || null, // populated after completion
          failedReason: job.failedReason || null,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new CertificateController();
