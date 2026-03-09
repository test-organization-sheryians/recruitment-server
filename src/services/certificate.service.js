import MongoCertificateRepository from "../repositories/implementations/mongoCertificateRepository.js";
import { AppError } from "../utils/errors.js";
import mongoose from "mongoose";
import xlsx from "xlsx";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { emailQueue } from "../queues/emailQueue.js";
import { s3Client, AWS_S3_BUCKET, getPublicS3Url } from "../config/getAwsS3PutObjectUrl.js";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const BulkCertificateGenerator = require("../utils/pdf-puppeteer/generate-multiple.cjs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_GENERATOR_DIR = path.resolve(__dirname, "../utils/pdf-puppeteer");
const PDF_OUTPUT_DIR = path.join(PDF_GENERATOR_DIR, "output");
const PDF_EXCEL_PATH = path.join(PDF_GENERATOR_DIR, "students.xlsx");

class CertificateService {
  constructor() {
    this.certificateRepository = new MongoCertificateRepository();
  }

  normalizeRecord(record) {
    const normalized = {};
    Object.entries(record).forEach(([key, value]) => {
      if (!key) return;
      const keyString = String(key).trim();
      normalized[keyString] = value;
      normalized[keyString.toLowerCase()] = value;
    });
    return normalized;
  }

  async uploadPdfToS3({ pdfBuffer, studentName }) {
    const safeName = String(studentName).replace(/[^a-zA-Z0-9]/g, "_");
    const key = `uploads/certificates/${Date.now()}_${safeName}.pdf`;

    await s3Client.send(new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    }));

    return getPublicS3Url(key);
  }

 async generateAndSendCertificates({ templateS3Url, excelFileBuffer }) {
  if (!templateS3Url || !excelFileBuffer) {
    throw new AppError("Template URL and excel file are required", 400);
  }

  // 1. Sabse pehle Excel validate karein
  const workbook = xlsx.read(excelFileBuffer, { type: "buffer" });
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });

  if (rows.length === 0) throw new AppError("Excel file is empty", 400);

  // Column aur Data Check
  const hasEmailColumn = rows[0].hasOwnProperty("Email Address");
  // const missingEmailRow = rows.find(r => !r["Email Address"] || String(r["Email Address"]).trim() === "");

  // if (!hasEmailColumn) {
  //   throw new AppError("Excel file is missing the 'Email Address' column.", 400);
  // }
  // if (missingEmailRow) {
  //   throw new AppError("Some rows do not contain email addresses. Certificates cannot be sent.", 400);
  // }



  // 2. Validation pass hone par hi process shuru karein
  await fs.writeFile(PDF_EXCEL_PATH, excelFileBuffer);

  const generator = new BulkCertificateGenerator({
    s3TemplateUrl: templateS3Url,
    excelPath: PDF_EXCEL_PATH
  });

  let generatedResults;
  try {
    generatedResults = await generator.generateAllCertificates();
  } catch (err) {
    throw new AppError(`PDF Generation Logic failed: ${err.message}`, 500);
  }

  // ... [Baaki ka logic jahan aap loop chala rahe hain] ...
  const result = { totalRows: rows.length, successCount: 0, failedCount: 0, generated: [], failed: [] };

  // for (const { studentName, pdfBuffer } of generatedResults) {
  //   // Ab yahan email validate karne ki zarurat nahi kyunki upar ho chuki hai
  //   const row = rows.find(r => r["Student Name"] === studentName);
  //   const studentEmail = row["Email Address"];

  //   this for loop work when email is missing .

  for (const { studentName, pdfBuffer } of generatedResults) {
  const row = rows.find(r => r["Student Name"] === studentName);

  const studentEmail = row ? row["Email Address"] : null;

  // skip if email missing
  if (!studentEmail || String(studentEmail).trim() === "") {
    result.failedCount++;
    result.failed.push({
      studentName,
      error: "Email missing - skipped"
    });
    continue;
  }

    const certificateUrl = await this.uploadPdfToS3({ pdfBuffer, studentName });

    await emailQueue.add("certificate-email", {
      to: studentEmail,
      studentName,
      certificateUrl
    });

    result.successCount++;
    result.generated.push({ studentName, email: studentEmail, certificateUrl });
  }

  if (existsSync(PDF_EXCEL_PATH)) await fs.unlink(PDF_EXCEL_PATH);
  return result;
}

  // --- STANDARD CRUD METHODS ---

  async createCertificate(data) {
    if (!data.name || !data.fileUrl) throw new AppError("Name and file URL required", 400);
    const exist = await this.certificateRepository.findByName(data.name);
    if (exist) throw new AppError("Certificate name already exists", 400);
    return await this.certificateRepository.create(data);
  }

  async getAllCertificates() {
    return await this.certificateRepository.findAll();
  }

  async getCertificateById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", 400);
    const cert = await this.certificateRepository.findById(id);
    if (!cert) throw new AppError("Certificate not found", 404);
    return cert;
  }

  async updateCertificate(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", 400);
    return await this.certificateRepository.update(id, updateData);
  }

  async deleteCertificate(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", 400);
    return await this.certificateRepository.delete(id);
  }
}

export default CertificateService;