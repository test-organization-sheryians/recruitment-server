class IJobApplicationRepository {
            async createJobApplication(jobAppData) {
                        throw new Error("Method not implemented");
            }

            async getJobApplication() {
                        throw new Error("Method not implemented")
            }

            async findByUserAndJob(userId, jobId) {
                        throw new Error("Method not implemented");
            }

            async updateApplicationStatus(applicationId, status) {
                        throw new Error("Method not implemented");
            }

}

export default IJobApplicationRepository;
