import MongoSavedCandidateRepository from "../repositories/implementations/mongoSavedCandidateRepository.js";
import { AppError } from "../utils/errors.js";

class SavedCandidateService {
constructor() {
    this.savedCandidateRepo = new MongoSavedCandidateRepository();
}

  async saveCandidate(savedBy, candidateId) {
    const isAlreadySaved = await this.savedCandidateRepo.checkCandidateSavedStatus(
      savedBy,
      candidateId
    );
    if (isAlreadySaved) {
      throw new AppError("Candidate already bookmarked", 409);
    }

    const saved = await this.savedCandidateRepo.saveCandidate(savedBy, candidateId);
    if (!saved) {
      throw new AppError("Failed to save candidate", 500);
    }
    return saved;
  }

  async getSavedCandidates(savedBy) {
    return this.savedCandidateRepo.getSavedCandidates(savedBy);
  }

  async removeSavedCandidate(savedBy, candidateId) {
    const removed = await this.savedCandidateRepo.removeSavedCandidate(savedBy, candidateId);
    if (!removed) {
      throw new AppError("Failed to remove saved candidate", 404);
    }
    return removed;
  }

  async checkCandidateSavedStatus(savedBy, candidateId) {
    const isSaved = await this.savedCandidateRepo.checkCandidateSavedStatus(savedBy, candidateId);
    return { isSaved };
  }
}

const savedCandidateService = new SavedCandidateService();

export default savedCandidateService;
