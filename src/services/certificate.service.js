import MongoCertificateRepository from "../repositories/implementations/mongoCertificateRepository.js";
import { AppError } from "../utils/errors.js";
import mongoose from "mongoose";

class CertificateService {
    constructor() {
        this.certificateRepository = new MongoCertificateRepository();
    }

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

        const updatedCertificate =
            await this.certificateRepository.update(
                id,
                updateData
            );

        return updatedCertificate;
    }

    async deleteCertificate(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid certificate ID", 400);
        }

        const certificate =
            await this.certificateRepository.findById(id);

        if (!certificate) {
            throw new AppError("Certificate not found", 404);
        }

        const deleted =
            await this.certificateRepository.delete(id);

        if (!deleted) {
            throw new AppError("Certificate not found", 404);
        }

        return deleted;
    }
}

export default CertificateService;
