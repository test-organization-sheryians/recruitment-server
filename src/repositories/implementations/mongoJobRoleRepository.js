import IJobRoleRepository from "../contracts/IJobRoleRepository.js";
import JobRole from "../../models/jobRole.model.js";
import { AppError } from "../../utils/errors.js";
import { paginateAggregation } from "../../utils/pagination.util.js";
import mongoose from "mongoose";

class MongoJobRoleRepository extends IJobRoleRepository {
  async createJobRole(jobRoleData) {
    try {
      const jobRole = new JobRole(jobRoleData);
      return await jobRole.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to create job role", 500);
    }
  }

  async findJobRoleById(id, userId) {
    try {
      const result = await JobRole.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "jobapplications",
            localField: "_id",
            foreignField: "jobId",
            as: "applications",
          }
        },

        {
          $addFields: {
            applied: {
              $cond: {
                if: userId
                  ? {
                    $in: [
                      new mongoose.Types.ObjectId(userId),
                      "$applications.candidateId"
                    ]
                  }
                  : false,
                then: true,
                else: false
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }]
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $project: {
            applications: 0
          }
        },
        {
          $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: true }
        }
      ]);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new AppError("Failed to find job role", 500);
    }
  }

  async findAllJobRoles(filter = {}, userId, page = 1, limit = 10) {
    try {
      const matchStage = {};

      if (filter.jobType) {
  matchStage.jobType = filter.jobType;
}


      if (filter.clientId) {
        matchStage.clientId = new mongoose.Types.ObjectId(filter.clientId);
      }

      if (filter.category) {
        matchStage.category = new mongoose.Types.ObjectId(filter.category);
      }

      if (filter.title) {
        matchStage.title = { $regex: filter.title, $options: "i" };
      }

      if (filter.minSalary || filter.maxSalary) {
  matchStage.$and = [];

  if (filter.minSalary) {
    matchStage.$and.push({
      "salary.max": { $gte: Number(filter.minSalary) }
    });
  }

  if (filter.maxSalary) {
    matchStage.$and.push({
      "salary.min": { $lte: Number(filter.maxSalary) }
    });
  }
}


      const now = new Date();
      if (filter.expiry === "active") {
        matchStage.$or = [
          { expiry: { $exists: false } },
          { expiry: { $gte: now } }
        ];
      } else if (filter.expiry === "expired") {
        matchStage.expiry = { $lt: now };
      } else {
        matchStage.$or = [
          { expiry: { $exists: false } },
          { expiry: { $gte: now } }
        ];
      }

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "jobapplications",
            localField: "_id",
            foreignField: "jobId",
            as: "applications",
          }
        },
        {
          $addFields: {
             applicantsCount: { $size: "$applications" },
            applied: {
              $cond: {
                if: userId
                  ? {
                    $in: [
                      new mongoose.Types.ObjectId(userId),
                      "$applications.candidateId"
                    ]
                  }
                  : false,
                then: true,
                else: false
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }]
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $project: {
            applications: 0
          }
        },
        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } }
      ];

      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch (error) {
      console.error(error);
      throw new AppError("Failed to fetch job roles", 500);
    }
  }

  async updateJobRole(id, jobRoleData) {
    try {
      return await JobRole.findByIdAndUpdate(id, jobRoleData, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to update job role", 500);
    }
  }

  async deleteJobRole(id) {
    try {
      return await JobRole.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete job role", 500);
    }
  }

  async findJobRolesByClient(clientId, page = 1, limit = 10) {
    try {
      const pipeline = [
        { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: false }
        },
        { $sort: { createdAt: -1 } }
      ];
      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch (error) {
      throw new AppError("Failed to fetch client job roles", 500);
    }
  }

  async findJobRolesByCategory(categoryId,page,limit,userId) {
    try {
      const pipeline = [
        { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
        {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications"
        }
      },

      {
        $addFields: {
          applied: {
            $cond: {
              if: userId
                ? {
                    $in: [
                      new mongoose.Types.ObjectId(userId),
                      "$applications.candidateId"
                    ]
                  }
                : false,
              then: true,
              else: false
            }
          }
        }
      },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },{
        $project: {
          applications: 0
        }
      },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: true }
        },
        { $sort: { createdAt: -1 } }
      ];
      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch (error) {
      throw new AppError("Failed to fetch category job roles", 500);
    }
  }



async findJobRolesBySearch(q, location, page, limit, userId, jobType) {

  try {
    const pipeline = [];
    const matchStage = {};

    if (jobType) {
  matchStage.jobType = jobType;
}


    if (q) {
      matchStage.title = { $regex: q, $options: "i" };
    }

    if (location) {
      matchStage.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $addFields: {
          applied: {
            $cond: {
              if: userId
                ? {
                    $in: [
                      new mongoose.Types.ObjectId(userId),
                      "$applications.candidateId",
                    ],
                  }
                : false,
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          applications: 0,
        },
      }
    );

    // Lookups
    pipeline.push(
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } }
    );

    return await paginateAggregation(JobRole, pipeline, { page, limit });
  } catch (error) {
    throw new AppError("Failed to fetch jobs.", 500);
  }
}


}

export default MongoJobRoleRepository;
