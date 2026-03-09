const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const xlsx = require("xlsx");
const axios = require("axios");

function formatDate(value) {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  }
  return String(value);
}

class BulkCertificateGenerator {
  constructor(options = {}) {
    this.s3TemplateUrl = options.s3TemplateUrl;
    this.excelPath = options.excelPath;
    this.cachedTemplate = null;

    if (this.outputDir && !fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // async initializeTemplate() {
  //   const localPath = path.join(__dirname, "certificate.html");

  //   if (!fs.existsSync(localPath)) {
  //     const response = await fetch(this.s3TemplateUrl);
  //     const html = await response.text();
  //     fs.writeFileSync(localPath, html, "utf-8");
  //   }

  //   const templateHtml = fs.readFileSync(localPath, "utf-8");
  //   this.cachedTemplate = Handlebars.compile(templateHtml);
  // }

  async initializeTemplate() {
  try {
    const response = await axios.get(this.s3TemplateUrl);
    const html = response.data;

    this.cachedTemplate = Handlebars.compile(html);
  } catch (error) {
    throw new Error("Failed to fetch template from S3: " + error.message);
  }
}

  normalizeRecord(record) {
    const normalized = {};
    Object.entries(record).forEach(([key, value]) => {
      if (!key) return;
      const keyString = String(key).trim();
      normalized[keyString] = value;               
      normalized[keyString.toLowerCase()] = value; 
      normalized[keyString.toLowerCase().replace(/\s+/g, "")] = value; 
    });
    return normalized;
  }

  async generatePdf(page, student) {
    const studentName = student["Student Name"];
    if (!studentName) throw new Error(`Student Name not found`);

    const finalHtml = this.cachedTemplate({
      name: studentName,
      internshipRole: student["Internship Role"] || "",
      organizationName: student["Organization"] || "",
      startDate: formatDate(student["Start Date"]),
      endDate: formatDate(student["End Date"]),
      //  add feature
      Feature: student["Feature"] || ""
    });

    // console.log(finalHtml)

    await page.setContent(finalHtml, { waitUntil: "load", timeout: 0 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" }
    });

    return { studentName, pdfBuffer }; 
  }

  async generateAllCertificates() {
    let browser = null;
    const results = []; 
    try {
      await this.initializeTemplate();
      const workbook = xlsx.readFile(this.excelPath);

      // const students = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      const students = xlsx.utils.sheet_to_json(
  workbook.Sheets[workbook.SheetNames[0]],
  { raw: false }
);

      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
      });

      const page = await browser.newPage();
      for (const student of students) {
        const result = await this.generatePdf(page, student);
        results.push(result);
      }
      return results; 
    } finally {
      if (browser) await browser.close();
    }
  }
}

module.exports = BulkCertificateGenerator;