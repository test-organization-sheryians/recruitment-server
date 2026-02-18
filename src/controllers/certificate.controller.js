import CertificateService from "../services/certificate.service.js";

class CertificateController {
  constructor() {
    this.certificateService = new CertificateService();
  }

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
