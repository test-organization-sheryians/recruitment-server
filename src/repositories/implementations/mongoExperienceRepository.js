import { Experience } from "../../models/experience.model.js";
import { AppError } from "../../utils/errors.js";
import IExperienceRepository from "../contracts/experienceRepository.js";


class MongoExperienceRepository extends IExperienceRepository {
  
  async createExperience(data) {
    try {
      const experience = await Experience.create(data);
      return experience;
    } catch (error) {
      throw new AppError("Error creating experience: " + error.message);
    }
  }

  async getExperiencesByCandidate(candidateId) {
    try {
      return await Experience.find({ candidateId })
        .sort({ startDate: -1 });
    } catch (error) {
      throw new AppError("Error fetching experiences: " + error.message);
    }
  }

  async getExperienceById(id) {
    try {
      return await Experience.findById(id);
    } catch (error) {
      throw new AppError("Error fetching experience by ID: " + error.message);
    }
  }

  async updateExperience(id, data) {
    try {
      const updated = await Experience.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updated;
    } catch (error) {
      throw new AppError("Error updating experience: " + error.message);
    }
  }

  async deleteExperience(id) {
    try {
      return await Experience.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Error deleting experience: " + error.message);
    }
  }
}

export default MongoExperienceRepository;
