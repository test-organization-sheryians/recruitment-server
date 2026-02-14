import { FreelancerProfile } from "../../models/freelancerProfile.model.js";
import sharePortfolioModel from "../../models/sharePortfolio.model.js";
import ISharePortfolioRepository from "../contracts/ISharePortfolioRepository.js";
import mongoose from "mongoose";
import { AppError } from "../../utils/errors.js";

class MongoSharePortfolioRepository extends ISharePortfolioRepository {
  async createPortfolio(freelancers) {
    try {
      const share = await sharePortfolioModel.create({
        selectedFreelancers: freelancers,
      });

      const shareLink = `http://localhost:9000/api/freelancer-share/${share._id}`;
      return shareLink;
    } catch (error) {
      throw new AppError(
        `Failed to create share portfolio: ${error.message}`,
        500,
        error,
      );
    }
  }

  async getSharedPortfolio(shareId) {
    try {
      const share = await sharePortfolioModel.findById(shareId);

      if (!share) {
        throw new AppError("Invalid or expired share link", 404);
      }

      const profiles = await FreelancerProfile.aggregate([
        {
          $match: {
            userId: {
              $in: share.selectedFreelancers.map(
                (id) => new mongoose.Types.ObjectId(id),
              ),
            },
          },
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
          $project: {
            _id: 1,
            userId: 1,
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
            skills: {
              $map: {
                input: "$skillDocs",
                as: "skill",
                in: {
                  _id: "$$skill._id",
                  name: "$$skill.name",
                },
              },
            },
          },
        },
      ]);

      return {
        count: profiles.length,
        data: profiles,
      };
    } catch (error) {
      console.error(error);
      throw new AppError(
        `Failed to fetch shared portfolio: ${error.message}`,
        500,
        error,
      );
    }
  }
}

export default MongoSharePortfolioRepository;
