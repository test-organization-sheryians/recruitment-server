class IJobApplicationRepository {
  async createJobApplication(jobAppData) {
    throw new Error("Method not implemented");
  }

<<<<<<< HEAD
            async getJobApplication() {
                        throw new Error("Method not implemented")
            }

            async findByUserAndJob(userId, jobId) {
                        throw new Error("Method not implemented");
            }

            async updateApplicationStatus(applicationId, status) {
                        throw new Error("Method not implemented");
            }

=======
  async findByUserAndJob(userId, jobId) {
    throw new Error("Method not implemented");
  }

  async updateApplicationStatus(applicationId, status) {
    throw new Error("Method not implemented");
  }
  async getAllApplications() {
    throw new Error("Method not implemented");
  }
  async filterApplications(status) {
    throw new Error("Method not implemented");
  }
>>>>>>> sumitsharma/JobApplication
}

export default IJobApplicationRepository;
