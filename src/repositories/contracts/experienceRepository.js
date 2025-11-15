import { AppError } from "../../utils/errors.js";

export class IExperienceRepository {
  create(data) {
    throw new AppError("Mehtod not implemented: create");
  }

  findByCandidateId(candidateId) {
    throw new AppError("Method not implemented: findByCandidate");
  }

  findById(id) {
    throw new AppError("Method not implemented: findById");
  }

  updateById(id, data) {
    throw new AppError("Method not implemented: updateById");
  }

  deleteById(id) {
    throw new AppError("Method not implemented: deleteById");
  }
}


export default IExperienceRepository