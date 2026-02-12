import { CandidateProfile } from "../../models/candidateProfile.model.js";
import shareCandidateModel from "../../models/shareCandidate.model.js";
import IshareCandidate from "../contracts/IShareCandidate.js";
import mongoose from 'mongoose';


class MongoShareCandidate extends IshareCandidate {
  async createCandidate(users) {
   try {
     const share = await shareCandidateModel.create({
      selectedUsers: users,
    });

    const shareLink = `hire.sheriyans.com/api/share/${share._id}`;
    return shareLink

   } catch (error) {
    throw new AppError(
        `Failed to update test attempt: ${error.message}`,
        500,
        error
      );
   }
  }

  async shareCandidate(shareId) {
    try {


      const share = await shareCandidateModel.findById(shareId);

      if (!share) {
         throw new AppError('Invalid or expired link', 404);
      }

      const profiles = await CandidateProfile.aggregate([
        {
          $match: {
            userId: {
              $in: share.selectedUsers.map(id => new mongoose.Types.ObjectId(id)),
            },
          },
        },

        // Populate user
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

        // Populate skills
        {
          $lookup: {
            from: 'skills',
            localField: 'skills',
            foreignField: '_id',
            as: 'skillDocs',
          },
        },

        // Populate experiences
        {
          $lookup: {
            from: 'experiences',
            localField: '_id',
            foreignField: 'candidateId',
            as: 'experiences',
          },
        },

        // Sort experiences
        {
          $addFields: {
            experiences: {
              $sortArray: {
                input: '$experiences',
                sortBy: { isCurrent: -1, startDate: -1 },
              },
            },
          },
        },

        // Final shape
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

            user: {
              _id: '$user._id',
              firstName: '$user.firstName',
              lastName: '$user.lastName',
              email: '$user.email',
            },

            skills: {
              $map: {
                input: '$skillDocs',
                as: 'skill',
                in: {
                  _id: '$$skill._id',
                  name: '$$skill.name',
                },
              },
            },

            experiences: {
              $map: {
                input: '$experiences',
                as: 'exp',
                in: {
                  _id: '$$exp._id',
                  company: '$$exp.company',
                  title: '$$exp.title',
                  location: '$$exp.location',
                  description: '$$exp.description',
                  startDate: '$$exp.startDate',
                  endDate: '$$exp.endDate',
                  isCurrent: '$$exp.isCurrent',
                },
              },
            },
          },
        },
      ]);

      // 3. Send response
    
      return ({
        count :profiles.length,
        data:profiles
      })
    } catch (error) {
      console.error(error);
      throw new AppError(
              `Failed to update test attempt: ${error.message}`,
              500,
              error
            );
    }
  }
}


export default MongoShareCandidate