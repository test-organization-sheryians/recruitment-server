import MongoCandidateProfileRepository from "../repositories/implementations/mongoCandidateProfileRepository.js";
import { AppError } from "../utils/errors.js";
import mongoose from "mongoose";

class CandidateProfileService {
  constructor() {
    this.candidateProfileRepository = new MongoCandidateProfileRepository();
  }

  async createProfile(profileData) {
    const existingProfile =
      await this.candidateProfileRepository.findProfileByUserId(
        profileData.userId
      );
    if (existingProfile) {
      throw new AppError("Profile already exists for this user", 409);
    }

    return await this.candidateProfileRepository.createProfile(profileData);
  }

  async getProfileByUserId(userId) {
    let profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      // Create a default profile if not found
      const profileData = { userId };
      profile = await this.candidateProfileRepository.createProfile(
        profileData
      );
    }
    return profile;
  }

  async updateProfile(userId, profileData) {
    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    return await this.candidateProfileRepository.updateProfile(
      profile._id,
      profileData
    );
  }

  async deleteProfile(userId) {
    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    return await this.candidateProfileRepository.deleteProfile(profile._id);
  }

  async addSkills(userId, skillIds) {
    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      throw new AppError("skillIds must be a non-empty array", 400);
    }

    for (const skillId of skillIds) {
      if (
        typeof skillId !== "string" ||
        !mongoose.Types.ObjectId.isValid(skillId)
      ) {
        throw new AppError(`Invalid skillId: ${skillId}`, 400);
      }
    }

    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const existingSkillIds = profile.skills.map((skill) =>
      skill._id.toString()
    );
    const duplicates = skillIds.filter((skillId) =>
      existingSkillIds.includes(skillId)
    );
    if (duplicates.length > 0) {
      throw new AppError(`Skills already added: ${duplicates.join(", ")}`, 400);
    }

    await this.candidateProfileRepository.addSkills(userId, skillIds);
    return await this.candidateProfileRepository.findProfileByUserId(userId);
  }

  async removeSkill(userId, skillId) {
    if (
      typeof skillId !== "string" ||
      !mongoose.Types.ObjectId.isValid(skillId)
    ) {
      throw new AppError("Invalid skillId", 400);
    }

    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    await this.candidateProfileRepository.removeSkill(userId, skillId);
    return await this.candidateProfileRepository.findProfileByUserId(userId);
  }

  async uploadResume(userId, resumeFile, resumeScore) {
    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    return await this.candidateProfileRepository.uploadResume(
      userId,
      resumeFile,
      resumeScore
    );
  }

  async deleteResume(userId) {
    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    if (!profile.resumeFile) {
      throw new AppError("No resume to delete", 404);
    }

    return await this.candidateProfileRepository.deleteResume(userId);
  }

  async updateAvailability(userId, availability) {
    const validAvailabilities = [
      "immediate",
      "1_week",
      "2_weeks",
      "1_month",
      "not_looking",
    ];
    if (!validAvailabilities.includes(availability)) {
      throw new AppError("Invalid availability status", 400);
    }

    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    return await this.candidateProfileRepository.updateAvailability(
      userId,
      availability
    );
  }

  // async getProfilesBySkills(skills) {
  //   if (!skills || !Array.isArray(skills) || skills.length === 0) {
  //     throw new AppError("Skills array is required", 400);
  //   }

  //   return await this.candidateProfileRepository.getProfilesBySkills(skills);
  // }
}

export default CandidateProfileService;
