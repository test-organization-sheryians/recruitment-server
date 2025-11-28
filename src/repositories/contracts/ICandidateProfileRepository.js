class ICandidateProfileRepository {
  async createProfile(profileData) {
    throw new Error("Method not implemented");
  }
  async findProfileByUserId(userId) {
    throw new Error("Method not implemented");
  }
  async updateProfile(id, profileData) {
    throw new Error("Method not implemented");
  }
  async deleteProfile(id) {
    throw new Error("Method not implemented");
  }
  async addSkills(userId, skillIds) {
    throw new Error("Method not implemented");
  }
  async removeSkill(userId, skillId) {
    throw new Error("Method not implemented");
  }
  async uploadResume(userId, resumeFile, resumeScore) {
    throw new Error("Method not implemented");
  }
  async deleteResume(userId) {
    throw new Error("Method not implemented");
  }
  async updateAvailability(userId, availability) {
    throw new Error("Method not implemented");
  }
}

export default ICandidateProfileRepository;
