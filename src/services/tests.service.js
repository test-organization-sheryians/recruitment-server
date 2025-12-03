import MongoTestRepository from "../repositories/implementations/mongoTestsRepository.js";
import { AppError } from "../utils/errors.js";

class TestService {
  constructor() {
    this.testRepository = new MongoTestRepository();
  }

  async createTest(testData) {
    const newTest = await this.testRepository.createTest(testData);
    if (!newTest) throw new AppError("Test creation failed", 500);
    return newTest;
  }

  async getTestById(id) {
    const test = await this.testRepository.findTestById(id);
    if (!test) throw new AppError("Test not found", 404);
    return test;
  }

  async findAllPublishedTests() {
    const tests = await this.testRepository.findAllPublishedTests();
    if (!tests || tests.length === 0) {
      throw new AppError("Tests not found", 404);
    }
    return tests;
  }

  async updateTest(id) {
    const test = await this.testRepository.updateTest(id);
    if (!test) throw AppError("Failed to update ", 500);
    return test;
  }
}

export default TestService;
