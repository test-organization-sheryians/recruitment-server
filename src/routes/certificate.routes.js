import express from "express";
import certificateController from "../controllers/certificate.controller.js";
import {
  createCertificateValidator,
  updateCertificateValidator,
} from "../middlewares/validators/certificate.vaildator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { uploadCertificateExcel } from "../middlewares/certificateUpload.middleware.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorize("admin"));

// Create Certificate
router.post("/", createCertificateValidator, certificateController.create);

// Find All Cretificate
router.get("/", certificateController.listAll);

// Generate certificates from template + excel, upload to S3 and email students
router.post(
  "/generate-and-send",
  uploadCertificateExcel,
  certificateController.generateAndSend
);

// Find By ID
router.get("/:id", certificateController.get);

// Update Cretificate
router.put(
  "/update/:id",
  updateCertificateValidator,
  certificateController.update,
);

// Delete Cretificate
router.delete("/:id", certificateController.delete);

export default router;
