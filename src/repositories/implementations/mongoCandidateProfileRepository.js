import mongoose from "mongoose";
import ICandidateProfileRepository from "../contracts/ICandidateProfileRepository.js";
import { CandidateProfile } from "../../models/candidateProfile.model.js";
import { AppError } from "../../utils/errors.js";

class MongoCandidateProfileRepository extends ICandidateProfileRepository {
  async createProfile(profileData) {
    try {
      const profile = new CandidateProfile(profileData);
      return await profile.save();
    } catch (error) {
      throw new AppError(
        `Failed to create profile: ${error.message}`,
        500,
        error
      );
    }
  }

  async findProfileByUserId(userId) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(userId);
      if (!isValid) return null;

      const [profile] = await CandidateProfile.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
<<<<<<< HEAD
            tenantId: 1,
=======
>>>>>>> 670c2be5969f9360bf1a79f9c3f1fde9afdc8dca
            experienceId: 1,
            availability: 1,
            linkedinUrl: 1,
            githubUrl: 1,
            portfolioUrl: 1,
            highestEducation: 1,
            resumeFile: 1,
            resumeScore: 1,
            skills: 1,
            user: {
              _id: "$user._id",
              firstName: "$user.firstName",
              lastName: "$user.lastName",
              email: "$user.email",
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $limit: 1 },
      ]);
      return profile || null;
    } catch (error) {
      throw new AppError(
        `Failed to find profile: ${error.message}`,
        500,
        error
      );
    }
  }

  async findProfileById(id) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) return null;

      return await CandidateProfile.findById(id)
        .populate("skills", "name category")
        .populate("userId", "firstName lastName email");
    } catch (error) {
      throw new AppError(
        `Failed to find profile: ${error.message}`,
        500,
        error
      );
    }
  }

  async updateProfile(id, profileData) {
    try {
<<<<<<< HEAD
      return await CandidateProfile.findByIdAndUpdate(id, profileData, {
        new: true,
      });
=======
      return await CandidateProfile.findByIdAndUpdate(id, 
        {$set: profileData},
        { new: true,}
      );
>>>>>>> 670c2be5969f9360bf1a79f9c3f1fde9afdc8dca
    } catch (error) {
      throw new AppError(
        `Failed to update profile: ${error.message}`,
        500,
        error
      );
    }
  }

  async deleteProfile(id) {
    try {
      return await CandidateProfile.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError(
        `Failed to delete profile: ${error.message}`,
        500,
        error
      );
    }
  }

  async addSkills(userId, skillIds) {
    try {
      const objectIds = skillIds.map((id) => new mongoose.Types.ObjectId(id));
      const profile = await CandidateProfile.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $addToSet: { skills: { $each: objectIds } } },
        { new: true }
      );
<<<<<<< HEAD
      if (profile) {
        await profile.populate("skills", "name category");
      }
=======
>>>>>>> 670c2be5969f9360bf1a79f9c3f1fde9afdc8dca
      return profile;
    } catch (error) {
      throw new AppError(`Failed to add skills: ${error.message}`, 500, error);
    }
  }

  async removeSkill(userId, skillId) {
    try {
      const profile = await CandidateProfile.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $pull: { skills: new mongoose.Types.ObjectId(skillId) } },
        { new: true }
      );
<<<<<<< HEAD
      if (profile) {
        await profile.populate("skills", "name category");
      }
=======
>>>>>>> 670c2be5969f9360bf1a79f9c3f1fde9afdc8dca
      return profile;
    } catch (error) {
      throw new AppError(
        `Failed to remove skill: ${error.message}`,
        500,
        error
      );
    }
  }

  async uploadResume(userId, resumeFile, resumeScore) {
    try {
      return await CandidateProfile.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { resumeFile, resumeScore },
        { new: true }
      );
    } catch (error) {
      throw new AppError(
        `Failed to upload resume: ${error.message}`,
        500,
        error
      );
    }
  }

  async deleteResume(userId) {
    try {
      return await CandidateProfile.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $unset: { resumeFile: 1, resumeScore: 1 } },
        { new: true }
      );
    } catch (error) {
      throw new AppError(
        `Failed to delete resume: ${error.message}`,
        500,
        error
      );
    }
  }

  async updateAvailability(userId, availability) {
    try {
      return await CandidateProfile.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { availability },
        { new: true }
      );
    } catch (error) {
      throw new AppError(
        `Failed to update availability: ${error.message}`,
        500,
        error
      );
    }
  }
}

export default MongoCandidateProfileRepository;
