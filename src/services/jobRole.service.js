// src/services/jobRole.service.js
import MongoJobRoleRepository from "../repositories/implementations/mongoJobRoleRepository.js";
import { AppError } from "../utils/errors.js";

class JobRoleService {
  constructor() {
    this.jobRoleRepository = new MongoJobRoleRepository();
  }

  async createJobRole(jobRoleData) {
    // Business Logic: Ensure expiry date is valid
    const currentDate = new Date();
    const expiryDate = new Date(jobRoleData.expiry);

    if (expiryDate <= currentDate) {
      throw new AppError("Expiry date must be in the future", 400);
    }

    // Business Logic: Check for duplicate title for same client
    const existingJobRoles = await this.jobRoleRepository.findJobRolesByClient(jobRoleData.clientId);
    
    const rolesArray = Array.isArray(existingJobRoles) ? existingJobRoles : (existingJobRoles?.data || []);
  const duplicateTitle = rolesArray.find(
  role => role.title.toLowerCase() === jobRoleData.title.toLowerCase()
);

    if (duplicateTitle) {
      throw new AppError("A job role with this title already exists for this client", 409);
    }

    return await this.jobRoleRepository.createJobRole(jobRoleData);
  }

  async getAllJobRoles(filter = {}, userId, page = 1, limit = 10) {
    return await this.jobRoleRepository.findAllJobRoles(filter, userId, page, limit);
  }

  async getJobRoleById(id, userId) {
    const jobRole = await this.jobRoleRepository.findJobRoleById(id, userId);
    if (!jobRole) {
      throw new AppError("Job role not found", 404);
    }
    return jobRole;
  }

  async updateJobRole( id, jobRoleData) {
    // Business Logic: Validate expiry date if provided
    if (jobRoleData.expiry) {
      const currentDate = new Date();
      const expiryDate = new Date(jobRoleData.expiry);

      if (expiryDate <= currentDate) {
        throw new AppError("Expiry date must be in the future", 400);
      }
    }

    // Business Logic: Check for duplicate title if title or clientId is being updated
    if (jobRoleData.title || jobRoleData.clientId) {
      const existingJobRole = await this.jobRoleRepository.findJobRoleById(id);
      if (!existingJobRole) {
        throw new AppError("Job role not found", 404);
      }

      const titleToCheck = jobRoleData.title || existingJobRole.title;
      const clientIdToCheck = jobRoleData.clientId || existingJobRole.clientId;

      const existingJobRoles = await this.jobRoleRepository.findJobRolesByClient(clientIdToCheck);
      const rolesArray = Array.isArray(existingJobRoles) ? existingJobRoles : (existingJobRoles?.docs || existingJobRoles?.data || []);
    const duplicateTitle = rolesArray.find(
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

  async getJobRolesByClient(clientId, page = 1, limit = 10) {
    return await this.jobRoleRepository.findJobRolesByClient(clientId, page, limit);
  }

  async getJobRolesByCategory(categoryId,page,limit,userId) {
    return await this.jobRoleRepository.findJobRolesByCategory(categoryId,page,limit,userId);
  }

  async getActiveJobRoles(page = 1, limit = 10) {
    const currentDate = new Date();
    return await this.jobRoleRepository.findAllJobRoles({
      expiry: 'active'
    }, undefined, page, limit);
  }

  async getExpiredJobRoles(page = 1, limit = 10) {
    return await this.jobRoleRepository.findAllJobRoles({
      expiry: 'expired'
    }, undefined, page, limit);
  }

  async searchJobRoles(q,location,page,limit,userId){
console.log("search query data in service file===>",q,location,page,limit,userId)
// if(!q || q.trim().length== 0 )   throw new AppError("Search query is required", 400);
 const normalizedQuery = q.trim();
 const normalizedLocation = location.trim()
  const jobRoles = await this.jobRoleRepository.findJobRolesBySearch(
    normalizedQuery,normalizedLocation,page,limit,userId
  );
  // if (!jobRoles || jobRoles.length === 0) {
  //   throw new AppError("No job roles found", 404);
  // }

  return jobRoles;
  }
}

export default JobRoleService;
