import MongoExperienceRepository from "../repositories/implementations/mongoExperienceRepository.js";
import { AppError } from "../utils/errors.js";

class ExperienceService {
  constructor() {
    this.experienceRepository = new MongoExperienceRepository();
  }
  async addExperience(data) {
    if (!data.candidateId) {
      throw new AppError("CandidateId is required ", 400);
    }
    if (data.isCurrent) {
      data.endDate = null;
    }
    return await this.experienceRepository.createExperience(data);
  }

  async getCandidateExperiences(candidateId) {
    if (!candidateId) {
      throw new AppError("candidateId is required", 400);
    }
    return await this.experienceRepository.findByCandidateId(
      candidateId
    );
  }
  async getSingleExperience(id) {
    if (!id) {
      throw new AppError("experience id is required", 400);
    }

    const experience = await this.experienceRepository.getExperienceById(id);

    if (!experience) {
      throw new AppError("Experience not found", 404);
    }

    return experience;
  }

  async updateExperience(experienceId, data) {

    if (!experienceId) {
      throw new AppError("experience id is required", 400);
    }
    if (data.isCurrent) {
      data.endDate = null;
    }
    const updated = await this.experienceRepository.updateExperience(
      experienceId,
      data
    );

    if (!updated) {
      throw new AppError("Failed to update — Experience not found", 404);
    }

    return updated;
  }

  async deleteExperience(experienceId, userId) {
    if (!experienceId) {
      throw new AppError("experience id is required", 400);
    }

    const user = await this.experienceRepository.getExperienceById(experienceId);
 
    if (userId !== user.candidateId.toString()) {
      throw new AppError("You are not allowed to delete", 401);
    }


    const deleted = await this.experienceRepository.deleteExperience(
      experienceId
    );

    console.log(deleted)

    if (!deleted) {
      throw new AppError("Failed to delete — Experience not found", 404);
    }

    return deleted;
  }
}

export default ExperienceService;
