import mongoose from "mongoose";
import { FreelancerProfile } from "../../models/freelancerProfile.model.js";
import IFreelancerProfileRepository from "../contracts/IFreelancerProfileRepository.js";
import { AppError } from "../../utils/errors.js";

class MongoFreelancerProfileRepository extends IFreelancerProfileRepository {
  _getProfileAggregationPipeline(userId) {
    return [
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skillDocs",
        },
      },
      {
        $lookup: {
          from: "experiences",
          localField: "_id",
          foreignField: "freelancerId",
          as: "experiences",
        },
      },
      {
        $addFields: {
          experiences: {
            $sortArray: {
              input: "$experiences",
              sortBy: { isCurrent: -1, startDate: -1 },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          skills: {
            $map: {
              input: "$skillDocs",
              as: "skill",
              in: { _id: "$$skill._id", name: "$$skill.name" },
            },
          },
          projects: 1,
          hourlyRate: 1,
          availability: 1,
          resumeFile: 1,
          portfolioScore: 1,
          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
          },
          experiences: 1,
        },
      },
      { $limit: 1 },
    ];
  }

  async createProfile(profileData) {
    try {
      const profile = new FreelancerProfile(profileData);
      return await profile.save();
    } catch (error) {
      throw new AppError(`Failed to create profile: ${error.message}`, 500);
    }
  }

  async findProfileByUserId(userId) {
    try {
      const [profile] = await FreelancerProfile.aggregate(
        this._getProfileAggregationPipeline(userId),
      );
      return profile || null;
    } catch (error) {
      throw new AppError(`Failed to find profile: ${error.message}`, 500);
    }
  }

  async addSkills(userId, skillIds) {
    try {
      const objectIds = skillIds.map((id) => new mongoose.Types.ObjectId(id));

      await FreelancerProfile.findOneAndUpdate(
        { userId },
        { $addToSet: { skills: { $each: objectIds } } },
      );

      const [profile] = await FreelancerProfile.aggregate(
        this._getProfileAggregationPipeline(userId),
      );
      return profile;
    } catch (error) {
      throw new AppError(`Failed to add skills: ${error.message}`, 500);
    }
  }

  async uploadResume(userId, resumeFile, portfolioScore) {
    try {
      await FreelancerProfile.findOneAndUpdate(
        { userId },
        { resumeFile, portfolioScore },
      );

      const [profile] = await FreelancerProfile.aggregate(
        this._getProfileAggregationPipeline(userId),
      );
      return profile;
    } catch (error) {
      throw new AppError(`Failed to upload resume: ${error.message}`, 500);
    }
  }

  async updateAvailability(userId, availability) {
    try {
      await FreelancerProfile.findOneAndUpdate({ userId }, { availability });

      const [profile] = await FreelancerProfile.aggregate(
        this._getProfileAggregationPipeline(userId),
      );
      return profile;
    } catch (error) {
      throw new AppError(
        `Failed to update availability: ${error.message}`,
        500,
      );
    }
  }
}

export default MongoFreelancerProfileRepository;
