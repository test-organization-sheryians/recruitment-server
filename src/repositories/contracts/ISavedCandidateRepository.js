export default class ISavedCandidateRepository {
  saveCandidate(savedBy, candidateId) {
    throw new Error("Method not implemented");
  }

  getSavedCandidates(savedBy, page = 1, limit = 10) {
    throw new Error("Method not implemented");
  }

  removeSavedCandidate(savedBy, candidateId) {
    throw new Error("Method not implemented");
  }

  checkCandidateSavedStatus(savedBy, candidateId) {
    throw new Error("Method not implemented");
  }
}
