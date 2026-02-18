class IJobReportRepository {
  async create(reportData) {
    throw new Error("Method not implemented");
  }

  async findByUserAndJob(userId, jobId) {
    throw new Error("Method not implemented");
  }

  async findByUser(userId) {
    throw new Error("Method not implemented");
  }

  async findAll(filter) {
    throw new Error("Method not implemented");
  }

  async findById(reportId) {
    throw new Error("Method not implemented");
  }

  async updateStatus(reportId, status) {
    throw new Error("Method not implemented");
  }

  async deleteById(reportId) {
    throw new Error("Method not implemented");
  }
}

export default IJobReportRepository;
