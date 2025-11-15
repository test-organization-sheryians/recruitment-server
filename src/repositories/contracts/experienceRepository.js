import { AppError } from "../../utils/errors.js";

export class IExperienceRepository {
  createExperience(data) {
    throw new AppError("Mehtod not implemented: create");
  }

  findByCandidateId(candidateId) {
    throw new AppError("Method not implemented: findByCandidate");
  }

  getExperienceById(id) {
    throw new AppError("Method not implemented: findById");
  }

  updateExperience(id, data) {
    throw new AppError("Method not implemented: updateById");
  }

  deleteExperience(id) {
    throw new AppError("Method not implemented: deleteById");
  }
}


export default IExperienceRepository