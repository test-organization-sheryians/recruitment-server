import express from "express";
import JobReportController from "../controllers/jobReport.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
// import validateRequest if you create validators later

const router = express.Router();

const jobReportController = new JobReportController();

/**
 * Create a job report
 * POST /api/job-reports
 */
router.post("/", authenticateJWT, jobReportController.reportJob);

/**
 * Get all reports (admin)
 * GET /api/job-reports
 */
router.get(
  "/",
  authenticateJWT,
  authorize("admin"),
  jobReportController.getAllReports,
);

/**
 * Get current user's reports
 * GET /api/job-reports/me
 */
router.get("/me", authenticateJWT, jobReportController.getMyReports);

/**
 * Update report status (admin)
 * PATCH /api/job-reports/:id
 */
router.put(
  "/:id",
  authenticateJWT,
  authorize("admin"),
  jobReportController.updateReportStatus,
);

/**
 * Delete report (admin)
 * DELETE /api/job-reports/:id
 */
router.delete(
  "/:id",
  authenticateJWT,
  authorize("admin"),
  jobReportController.deleteReport,
);

export default router;
