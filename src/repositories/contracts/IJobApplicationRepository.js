class IJobApplicationRepository {
  async createJobApplication(jobAppData) {
    throw new Error("Method not implemented");
  }

  async findByUserAndJob(userId, jobId) {
    throw new Error("Method not implemented");
  }

  async updateApplicationStatus(applicationId, status) {
    throw new Error("Method not implemented");
  }

  async bulkUpdateApplicationStatus(applicationIds, status){
    throw new Error("Method not implemented");
  }

  async getAllApplications(page = 1, limit = 10) {
    throw new Error("Method not implemented");
  }
  async filterApplications(status, page = 1, limit = 10) {
    throw new Error("Method not implemented");
  }
  async getCandidateAllApplications(candidateId, page = 1, limit = 10) {
    throw new Error("Method not implemented");
  }
}

export default IJobApplicationRepository;
