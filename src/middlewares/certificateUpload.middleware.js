import multer from "multer";
import { AppError } from "../utils/errors.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileName = (file.originalname || "").toLowerCase();
    const validExcelTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const isExcelFile = validExcelTypes.includes(file.mimetype) || fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (isExcelFile) {
      return cb(null, true);
    }

    return cb(new AppError("Invalid file type. Only .xlsx/.xls files are allowed", 400));
  },
});

export const uploadCertificateExcel = upload.single("excel");
