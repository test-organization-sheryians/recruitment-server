import MongoCertificateRepository from "../repositories/implementations/mongoCertificateRepository.js";
import { AppError } from "../utils/errors.js";
import mongoose from "mongoose";
import puppeteer from "puppeteer";
import axios from "axios";
import Handlebars from "handlebars";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

// ✅ Reuse existing s3Client — no new instance
import { s3Client } from "../config/getAwsS3PutObjectUrl.js";

class CertificateService {
  constructor() {
    this.certificateRepository = new MongoCertificateRepository();
  }

  // ─── Existing CRUD Methods (unchanged) ──────────────────────────────────

  async createCertificate(data) {
    if (!data.name || !data.fileUrl) {
      throw new AppError("Certificate name and file URL are required", 400);
    }

    const exist = await this.certificateRepository.findByName(data.name);
    if (exist) throw new AppError("Cretificate name already exists", 400);

    return await this.certificateRepository.create(data);
  }

  async getAllCertificates() {
    return await this.certificateRepository.findAll();
  }

  async getCertificateById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid certificate ID", 400);
    }

    const certificate = await this.certificateRepository.findById(id);

    if (!certificate) {
      throw new AppError("Certificate not found", 404);
    }

    return certificate;
  }

  async updateCertificate(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid certificate ID", 400);
    }

    const existingCertificate = await this.certificateRepository.findById(id);

    if (!existingCertificate) {
      throw new AppError("Certificate not found", 404);
    }

    const updatedCertificate = await this.certificateRepository.update(
      id,
      updateData,
    );

    return updatedCertificate;
  }

  async deleteCertificate(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid certificate ID", 400);
    }

    const certificate = await this.certificateRepository.findById(id);

    if (!certificate) {
      throw new AppError("Certificate not found", 404);
    }

    const deleted = await this.certificateRepository.delete(id);

    if (!deleted) {
      throw new AppError("Certificate not found", 404);
    }

    return deleted;
  }

  // ─── NEW: Bulk Certificate Generation Methods ────────────────────────────

  // Fetch HTML template from S3 and compile it with Handlebars (once per job)
  async #fetchAndCompileTemplate() {
    const templateUrl = process.env.CERTIFICATE_TEMPLATE_URL;
    if (!templateUrl)
      throw new AppError("CERTIFICATE_TEMPLATE_URL is not set in .env", 500);

    logger.info("Fetching certificate template from S3...");
    const response = await axios.get(templateUrl);
    return Handlebars.compile(response.data);
  }

  // Generate PDF buffer for a single student
  async #generatePdfBuffer(page, compiledTemplate, student) {
    const finalHtml = compiledTemplate({
      name: student.name,
      internshipRole: student.internshipRole,
      organizationName: student.organizationName || "Sheryians Coding School",
      startDate: student.startDate,
      endDate: student.endDate,
    });

    await page.setContent(finalHtml, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });
  }

  // Upload PDF buffer directly to S3, return the public URL
  async #uploadPdfToS3(pdfBuffer, studentName) {
    const sanitizedName = studentName.replace(/\s+/g, "_");
    const key = `certificates/${sanitizedName}_${uuidv4()}.pdf`;

    // ✅ Using existing s3Client from getAwsS3PutObjectUrl.js
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "sherihunt",
        Key: key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      }),
    );

    const certificateUrl = `https://sherihunt.s3.ap-south-1.amazonaws.com/${key}`;
    logger.info(`Uploaded to S3: ${certificateUrl}`);
    return certificateUrl;
  }

  /**
   * Main method — called by certificateWorker
   * Generates PDFs for all students, uploads to S3, returns results with URLs
   *
   * @param {Array} students - [{ name, email, internshipRole, organizationName, startDate, endDate }]
   * @param {Function} onProgress - optional (done, total) => void for BullMQ progress tracking
   * @returns {Array} results - [{ name, email, internshipRole, startDate, endDate, certificateUrl, status, error? }]
   */
  async generateBulkCertificates(students, onProgress = null) {
    const compiledTemplate = await this.#fetchAndCompileTemplate();

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const results = [];

    try {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];

        try {
          logger.info(
            `Generating certificate ${i + 1}/${students.length}: ${student.name}`,
          );

          const pdfBuffer = await this.#generatePdfBuffer(
            page,
            compiledTemplate,
            student,
          );
          const certificateUrl = await this.#uploadPdfToS3(
            pdfBuffer,
            student.name,
          );

          results.push({
            name: student.name,
            email: student.email,
            internshipRole: student.internshipRole,
            startDate: student.startDate,
            endDate: student.endDate,
            certificateUrl,
            status: "success",
          });
        } catch (err) {
          logger.error(`Failed for ${student.name}: ${err.message}`);
          results.push({
            name: student.name,
            email: student.email,
            certificateUrl: null,
            status: "failed",
            error: err.message,
          });
        }

        if (onProgress) onProgress(i + 1, students.length);
      }
    } finally {
      await browser.close();
    }

    return results;
  }
}

export default CertificateService;
