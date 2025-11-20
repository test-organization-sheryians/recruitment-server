import mongoose from "mongoose";
import ICandidateProfileRepository from "../contracts/ICandidateProfileRepository.js";
import { CandidateProfile } from "../../models/candidateProfile.model.js";
import { AppError } from "../../utils/errors.js";

class MongoCandidateProfileRepository extends ICandidateProfileRepository {

  _getProfileAggregationPipeline(userId) {
    return [
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
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills",
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
          experienceId: 1,
          availability: 1,
          linkedinUrl: 1,
          githubUrl: 1,
          portfolioUrl: 1,
          highestEducation: 1,
          resumeFile: 1,
          resumeScore: 1,

          // ⭐ MOST IMPORTANT PART
          skills: {
            $map: {
              input: "$skills",
              as: "s",
              in: "$$s.name"
            }
          },

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
    ];
  }

  async createProfile(profileData) {
    try {
      const profile = new CandidateProfile(profileData);
      return await profile.save();
    } catch (error) {
      throw new AppError(`Failed to create profile: ${error.message}`, 500);
    }
  }

  async findProfileByUserId(userId) {
    try {
      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );
      return profile || null;
    } catch (error) {
      throw new AppError(`Failed to find profile: ${error.message}`, 500);
    }
  }

  async updateProfile(id, profileData) {
    try {
      return await CandidateProfile.findByIdAndUpdate(
        id,
        { $set: profileData },
        { new: true }
      );
    } catch (error) {
      throw new AppError(`Failed to update profile: ${error.message}`, 500);
    }
  }

  async deleteProfile(id) {
    try {
      return await CandidateProfile.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError(`Failed to delete profile: ${error.message}`, 500);
    }
  }

  async addSkills(userId, skillIds) {
    try {
      const objectIds = skillIds.map((id) => new mongoose.Types.ObjectId(id));

      await CandidateProfile.findOneAndUpdate(
        { userId },
        { $addToSet: { skills: { $each: objectIds } } }
      );

      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );

      return profile;
    } catch (error) {
      throw new AppError(`Failed to add skills: ${error.message}`, 500);
    }
  }

  async removeSkill(userId, skillId) {
    try {
      await CandidateProfile.findOneAndUpdate(
        { userId },
        { $pull: { skills: new mongoose.Types.ObjectId(skillId) } }
      );

      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );

      return profile;
    } catch (error) {
      throw new AppError(`Failed to remove skill: ${error.message}`, 500);
    }
  }

  async uploadResume(userId, resumeFile, resumeScore) {
    try {
      await CandidateProfile.findOneAndUpdate(
        { userId },
        { resumeFile, resumeScore }
      );

      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );

      return profile;
    } catch (error) {
      throw new AppError(`Failed to upload resume: ${error.message}`, 500);
    }
  }

  async deleteResume(userId) {
    try {
      await CandidateProfile.findOneAndUpdate(
        { userId },
        { $unset: { resumeFile: 1, resumeScore: 1 } }
      );

      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );

      return profile;
    } catch (error) {
      throw new AppError(`Failed to delete resume: ${error.message}`, 500);
    }
  }

  async updateAvailability(userId, availability) {
    try {
      await CandidateProfile.findOneAndUpdate(
        { userId },
        { availability }
      );

      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );

      return profile;
    } catch (error) {
      throw new AppError(`Failed to update availability: ${error.message}`, 500);
    }
  }
}

export default MongoCandidateProfileRepository;
