import express from "express";
import certificateController from "../controllers/certificate.controller.js";
import {
  createCertificateValidator,
  updateCertificateValidator,
} from "../middlewares/validators/certificate.vaildator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

// ✅ Reuse existing upload middleware — just import the new uploadExcel
import { uploadExcel } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorize("admin"));

// ─── Existing Routes (unchanged) ────────────────────────────────────────────
router.post("/", createCertificateValidator, certificateController.create);
router.get("/", certificateController.listAll);
router.get("/:id", certificateController.get);
router.put(
  "/update/:id",
  updateCertificateValidator,
  certificateController.update,
);
router.delete("/:id", certificateController.delete);

// ─── NEW: Bulk Certificate Generation ───────────────────────────────────────
// Admin uploads Excel file → parsed → certificates generated → emails sent
router.post(
  "/generate-bulk",
  uploadExcel, // multer parses xlsx into req.file.buffer
  certificateController.generateBulk,
);

// Admin polls job progress
router.get("/job-status/:jobId", certificateController.getJobStatus);

export default router;
