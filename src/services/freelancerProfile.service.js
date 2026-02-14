import MongoFreelancerProfileRepository from "../repositories/implementations/mongoFreelancerProfile.js";

class FreelancerProfileService {
  constructor() {
    this.freelancerProfileRepository = new MongoFreelancerProfileRepository();
  }

  async createProfile(profileData) {
    return await this.freelancerProfileRepository.createProfile(profileData);
  }

  async findProfileByUserId(userId) {
    return await this.freelancerProfileRepository.findProfileByUserId(userId);
  }

  async addSkills(userId, skillIds) {
    return await this.freelancerProfileRepository.addSkills(userId, skillIds);
  }

  async uploadResume(userId, resumeFile, portfolioScore) {
    return await this.freelancerProfileRepository.uploadResume(
      userId,
      resumeFile,
      portfolioScore,
    );
  }

  async updateAvailability(userId, availability) {
    return await this.freelancerProfileRepository.updateAvailability(
      userId,
      availability,
    );
  }
}

export default FreelancerProfileService;
