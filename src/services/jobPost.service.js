import MongoJobPostRepository from "../repositories/implementations/mongoJobPost.js";
import { AppError } from "../utils/errors.js";

class JobPostService {
  constructor() {
    this.jobPostRepository = new MongoJobPostRepository();
  }
  async createJobPost(jobPostData) {
    try {
      return await this.jobPostRepository.create(jobPostData);
    } catch (error) {
      throw error;
    }
  }
  async getJobPostById(id) {
    try {
      return await this.jobPostRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }
  async getAllJobPosts() {
    try {
      return await this.jobPostRepository.findAll();
    } catch (error) {
      throw error;
    }
  }
  async updateJobPost(id, updateData) {
    try {
      return await this.jobPostRepository.updateById(id, updateData);
    } catch (error) {
      throw error;
    }
  }
  async deleteJobPost(id) {
    try {
      return await this.jobPostRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }
}

export default JobPostService;
