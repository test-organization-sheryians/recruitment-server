// src/services/jobRole.service.js
import MongoJobRoleRepository from "../repositories/implementations/mongoJobRoleRepository.js";
import { AppError } from "../utils/errors.js";

class JobRoleService {
  constructor() {
    this.jobRoleRepository = new MongoJobRoleRepository();
  }

  async createJobRole(jobRoleData) {
    const currentDate = new Date();
    const expiryDate = new Date(jobRoleData.expiry);
    
    if (expiryDate <= currentDate) {
      throw new AppError("Expiry date must be in the future", 400);
    }

    const existingJobRoles = await this.jobRoleRepository.findJobRolesByClient(jobRoleData.clientId);
    const duplicateTitle = existingJobRoles.find(
      role => role.title.toLowerCase() === jobRoleData.title.toLowerCase()
    );
    
    if (duplicateTitle) {
      throw new AppError("A job role with this title already exists for this client", 409);
    }

    return await this.jobRoleRepository.createJobRole(jobRoleData);
  }

  async getAllJobRoles(filter = {}) {
    
    return await this.jobRoleRepository.findAllJobRoles(filter);
  }

  async getJobRoleById(id , userId) {
    const jobRole = await this.jobRoleRepository.findJobRoleById(id , userId);
    if (!jobRole) {
      throw new AppError("Job role not found", 404);
    }
    return jobRole;
  }

  async updateJobRole(id, jobRoleData) {
    if (jobRoleData.expiry) {
      const currentDate = new Date();
      const expiryDate = new Date(jobRoleData.expiry);
      
      if (expiryDate <= currentDate) {
        throw new AppError("Expiry date must be in the future", 400);
      }
    }

    if (jobRoleData.title || jobRoleData.clientId) {
      const existingJobRole = await this.jobRoleRepository.findJobRoleById(id);
      if (!existingJobRole) {
        throw new AppError("Job role not found", 404);
      }

      const titleToCheck = jobRoleData.title || existingJobRole.title;
      const clientIdToCheck = jobRoleData.clientId || existingJobRole.clientId;
      
      const existingJobRoles = await this.jobRoleRepository.findJobRolesByClient(clientIdToCheck);
      const duplicateTitle = existingJobRoles.find(
        role => role.title.toLowerCase() === titleToCheck.toLowerCase() && 
               role._id.toString() !== id
      );
      
      if (duplicateTitle) {
        throw new AppError("A job role with this title already exists for this client", 409);
      }
    }

    const jobRole = await this.jobRoleRepository.updateJobRole(id, jobRoleData);
    if (!jobRole) {
      throw new AppError("Job role not found", 404);
    }
    return jobRole;
  }

  async deleteJobRole(id) {
    const jobRole = await this.jobRoleRepository.deleteJobRole(id);
    if (!jobRole) {
      throw new AppError("Job role not found", 404);
    }
    return jobRole;
  }

  async getJobRolesByClient(clientId) {
    return await this.jobRoleRepository.findJobRolesByClient(clientId);
  }

  async getJobRolesByCategory(categoryId) {
    return await this.jobRoleRepository.findJobRolesByCategory(categoryId);
  }

  async getActiveJobRoles() {
    const currentDate = new Date();
    return await this.jobRoleRepository.findAllJobRoles({
      expiry: 'active'
    });
  }

  async getExpiredJobRoles() {
    return await this.jobRoleRepository.findAllJobRoles({
      expiry: 'expired'
    });
  }
}

export default JobRoleService;
