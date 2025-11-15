import MongoExperienceRepository from "../repositories/implementations/mongoExperienceRepository.js";
import { AppError } from "../utils/errors.js";


  class ExperienceService {
    constructor(){
        this.experienceRepository = new MongoExperienceRepository();
    }
    async addExperience(data){
        if(!data.candidateId ){
            throw new AppError ("CandidateId is required ")
        }
        if(data.isCurrent){
            data.endDate = null
        }
        // if(!data.company || !data.title || !data.startDate ){
        //     throw new AppError ("Company, title, and startDate are required")
        // }
          return await this.experienceRepository.createExperience(data);
    }
     async getCandidateExperiences(candidateId) {
    if (!candidateId) {
      throw new AppError("candidateId is required");
    }
       return await this.experienceRepository.getExperiencesByCandidate(candidateId);
  }
//     async getSingleExperience(id) {
//     if (!id) {
//       throw new AppError("experience id is required");
//     }

//     const experience = await this.experienceRepository.getExperienceById(id);

//     if (!experience) {
//       throw new AppError("Experience not found");
//     }

//     return experience;
//   }
    async updateExperience(experienceId, data) {
    if (!experienceId) {
      throw new AppError("experience id is required");
    }
if(data.isCurrent){
    data.endDate = null
}
    const updated = await this.experienceRepository.updateExperience(experienceId, data);

    if (!updated) {
      throw new AppError("Failed to update — Experience not found");
    }

    return updated;
  }
  
  async deleteExperience(experienceId) {
    if (!experienceId) {
      throw new AppError("experience id is required");
    }

    const deleted = await this.experienceRepository.deleteExperience(experienceId);

    if (!deleted) {
      throw new AppError("Failed to delete — Experience not found");
    }

    return deleted;
  }
}

export default ExperienceService;