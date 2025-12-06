import mongoose from "mongoose";
import ICandidateProfileRepository from "../contracts/ICandidateProfileRepository.js";
import { CandidateProfile } from "../../models/candidateProfile.model.js";
import { AppError } from "../../utils/errors.js";

class MongoCandidateProfileRepository extends ICandidateProfileRepository {
_getProfileAggregationPipeline(userId) {
  return [
    // 1. Find the candidate profile by userId
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },

    // 2. Populate basic user info
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

    // 3. Populate skills → return only the name as string[]
    {
      $lookup: {
        from: "skills",
        localField: "skills",
        foreignField: "_id",
        as: "skillDocs"
      }
    },

    // 4. Populate experiences → full objects (not just _id)
    {
      $lookup: {
        from: "experiences",           // ← Make sure collection name matches exactly!
        localField: "_id",
        foreignField: "candidateId",
        as: "experiences"
      }
    },

    // 5. Sort experiences: current first, then by startDate descending
    {
      $addFields: {
        experiences: {
          $sortArray: {
            input: "$experiences",
            sortBy: { isCurrent: -1, startDate: -1 }
          }
        }
      }
    },

    // 6. Final projection
    {
      $project: {
        _id: 1,
        userId: 1,
        availability: 1,
        linkedinUrl: 1,
        githubUrl: 1,
        portfolioUrl: 1,
        highestEducation: 1,
        resumeFile: 1,
        resumeScore: 1,
        createdAt: 1,
        updatedAt: 1,

        // User info
        user: {
          _id: "$user._id",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          email: "$user.email",
          // add avatar, role, etc. if needed
        },
        

        // Skills → array of strings (names only)
        skills: {
          $map: {
            input: "$skillDocs",
            as: "skill",
            in: {
              name: "$$skill.name" , 
               _id:"$$skill._id"
            }
          }
        },

       
        // Full experience objects (with all fields)
        experiences: {
          $map: {
            input: "$experiences",
            as: "exp",
            in: {
              _id: "$$exp._id",
              company: "$$exp.company",
              title: "$$exp.title",
              location: "$$exp.location",
              description: "$$exp.description",
              startDate: "$$exp.startDate",
              endDate: "$$exp.endDate",
              isCurrent: "$$exp.isCurrent"
            }
          }
        }
      }
    },

    { $limit: 1 }
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
      await CandidateProfile.findOneAndUpdate({ userId }, { availability });

      const [profile] = await CandidateProfile.aggregate(
        this._getProfileAggregationPipeline(userId)
      );

      return profile;
    } catch (error) {
      throw new AppError(
        `Failed to update availability: ${error.message}`,
        500
      );
    }
  }
}

export default MongoCandidateProfileRepository;
