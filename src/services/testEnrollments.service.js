import MongoEnrollmentsRespository from "../repositories/implementations/mongoEnrollmentsRepository.js";

class TestEnrollmentService {
  constructor() {
    this.testEnrollmentRepository = new MongoEnrollmentsRespository();
  }

  async enrollUser(testId, email) {
    const existingEnrollment =
      await this.testEnrollmentRepository.findEnrollment(testId, email);
    if (existingEnrollment) {
      return existingEnrollment;
    }
    return await this.testEnrollmentRepository.enrollUser(testId, email);
  }

  async getAssignedTests(email) {
    return await this.testEnrollmentRepository.findEnrollmentsByUser(email);
  }
}

export default TestEnrollmentService;
