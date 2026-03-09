import CertificateService from "../services/certificate.service.js";

class CertificateController {
  constructor() {
    this.certificateService = new CertificateService();
  }


  
  generateAndSend = async (req, res, next) => {
  try {
    const excelFile = req.file;
    const { templateUrl } = req.body;

    // Validation: Check agar file exist karti hai
    if (!excelFile) {
      throw new AppError("Excel file is missing", 400);
    }

    // Service call karein
    const result = await this.certificateService.generateAndSendCertificates({
      templateS3Url: templateUrl,
      excelFileBuffer: excelFile?.buffer,
    });

    // Ab yahan success message return karein
    return res.status(200).json({
      success: true,
      data: result,
      message: "Certificates generated and sent successfully",
    });
  } catch (err) {
    // Agar Service layer mein koi validation error (jaise missing email) hua, 
    // toh next(err) use catch karega aur client ko 400 error bhejega.
    next(err); 
  }
};



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
}

export default new CertificateController();
