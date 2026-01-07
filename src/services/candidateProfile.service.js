import MongoCandidateProfileRepository from "../repositories/implementations/mongoCandidateProfileRepository.js";
import MongoSkillRepository from "../repositories/implementations/mongoSkillRepository.js";
import User from "../models/user.model.js";
import { AppError } from "../utils/errors.js";
import mongoose from "mongoose";

class CandidateProfileService {
  constructor() {
    this.candidateProfileRepository = new MongoCandidateProfileRepository();
    this.skillRepository = new MongoSkillRepository();
  }

  async createProfile(profileData) {
    const existingProfile =
      await this.candidateProfileRepository.findProfileByUserId(
        profileData.userId
      );

    if (existingProfile) {
      throw new AppError("Profile already exists for this user", 409);
    }

    if (profileData.skills && Array.isArray(profileData.skills)) {
      const trimmedSkillNames = profileData.skills
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (trimmedSkillNames.length > 0) {
        const skillIds = [];

        for (const skillName of trimmedSkillNames) {
          let skill = await this.skillRepository.findSkillByName(skillName);

          if (!skill) {
            skill = await this.skillRepository.createSkill({ name: skillName });
          }

          skillIds.push(skill._id);
        }

        profileData.skills = skillIds;
      } else {
        delete profileData.skills;
      }
    }

    await this.candidateProfileRepository.createProfile(profileData);

    return await this.candidateProfileRepository.findProfileByUserId(
      profileData.userId
    );
  }

  async getProfileByUserId(userId) {
    let candidateProfile =
      await this.candidateProfileRepository.findProfileByUserId(userId);

    if (!candidateProfile) {
      candidateProfile =
        await this.candidateProfileRepository.createProfile({ userId });
    }

    const user = await User.findById(userId).select(
      "firstName lastName email phoneNumber"
    );

    const profileObject =
      candidateProfile.toObject?.() ?? candidateProfile;

    const completion = await this.calculateProfileInfoo({
      ...profileObject,
      user,
    });

    return {
      ...profileObject,
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
          }
        : null,
      completion,
    };
  }

  async updateProfile(userId, profileData) {
    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) throw new AppError("Profile not found", 404);

    await this.candidateProfileRepository.updateProfile(
      profile._id,
      profileData
    );

    return await this.candidateProfileRepository.findProfileByUserId(userId);
  }

  async deleteProfile(userId) {
    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const deletedProfile = await this.candidateProfileRepository.deleteProfile(
      profile._id
    );
    if (!deletedProfile) {
      throw new AppError("Profile not found", 404);
    }

    return deletedProfile;
  }

  async addSkills(userId, skillNames) {
    if (typeof skillNames === "string") {
      skillNames = [skillNames];
    }

    if (!Array.isArray(skillNames) || skillNames.length === 0) {
      throw new AppError(
        "skillNames must be a non-empty array or a valid skillName string",
        400
      );
    }

    const trimmedSkillNames = skillNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (trimmedSkillNames.length === 0) {
      throw new AppError("No valid skill names provided", 400);
    }

    const skillIds = [];
    for (const skillName of trimmedSkillNames) {
      let skill = await this.skillRepository.findSkillByName(skillName);

      if (!skill) {
        skill = await this.skillRepository.createSkill({ name: skillName });
      }

      skillIds.push(skill._id.toString());
    }

    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const existingSkillNames = profile.skills.map((s) => s.toLowerCase());

    const duplicates = trimmedSkillNames.filter((name) =>
      existingSkillNames.includes(name.toLowerCase())
    );

    if (duplicates.length > 0) {
      throw new AppError(`Skills already added: ${duplicates.join(", ")}`, 400);
    }

    await this.candidateProfileRepository.addSkills(userId, skillIds);
    return await this.candidateProfileRepository.findProfileByUserId(userId);
  }

  async removeSkill(userId, skillName) {
    if (typeof skillName !== "string" || skillName.trim().length === 0) {
      throw new AppError("Invalid skill name", 400);
    }

    const trimmedSkillName = skillName.trim();

    const skill = await this.skillRepository.findSkillByName(trimmedSkillName);
    if (!skill) {
      throw new AppError("Skill not found", 404);
    }

    const profile = await this.candidateProfileRepository.findProfileByUserId(
      userId
    );
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const skillExists = profile.skills.some(
      (s) => s.toLowerCase() === trimmedSkillName.toLowerCase()
    );

    if (!skillExists) {
      throw new AppError("Skill not found in profile", 404);
    }

    await this.candidateProfileRepository.removeSkill(
      userId,
      skill._id.toString()
    );

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

  async calculateProfileInfoo(profile) {
    const rules = [
      {
        condition:
          profile.user?.firstName &&
          profile.user?.lastName &&
          profile.user?.email,
        score: 20,
      },
      {
        condition: profile.skills?.length > 0,
        score: 20,
      },
      {
        condition: profile.experiences?.length > 0,
        score: 20,
      },
      {
        condition: Boolean(profile.resumeFile),
        score: 10,
      },
      {
        condition: profile.githubUrl?.trim(),
        score: 10,
      },
      {
        condition: profile.linkedinUrl?.trim(),
        score: 10,
      },
      {
        condition: profile.portfolioUrl?.trim(),
        score: 10,
      },
    ];

    return rules.reduce(
      (total, rule) => total + (rule.condition ? rule.score : 0),
      0
    );
  }
}

export default CandidateProfileService;
