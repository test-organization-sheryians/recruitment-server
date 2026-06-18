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
        throw new AppError(
          "Job role with this title already exists for this client",
          409,
        );
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
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }],
          },
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
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
          $project: {
            applications: 0,
          },
        },
        {
          $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
        },
      ]);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new AppError("Failed to find job role", 500);
    }
  }

  async findAllJobRoles(filter = {}, userId, page = 1, limit = 10) {
    try {
      const matchStage = {};

      if (filter.clientId) {
        matchStage.clientId = new mongoose.Types.ObjectId(filter.clientId);
      }

      if (filter.category) {
        matchStage.category = new mongoose.Types.ObjectId(filter.category);
      }

      if (filter.title) {
        matchStage.title = { $regex: filter.title, $options: "i" };
      }

      const now = new Date();
      if (filter.expiry === "active") {
        matchStage.$or = [
          { expiry: { $exists: false } },
          { expiry: { $gte: now } },
        ];
      } else if (filter.expiry === "expired") {
        matchStage.expiry = { $lt: now };
      } else {
        matchStage.$or = [
          { expiry: { $exists: false } },
          { expiry: { $gte: now } },
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
          },
        },
        {
          $lookup: {
            from: "jobapplicationquestions",
            localField: "_id",
            foreignField: "jobId",
            as: "questions",
          },
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
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }],
          },
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
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
          $project: {
            applications: 0,
          },
        },
        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
      ];

      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch (error) {
      console.error(error);
      throw new AppError("Failed to fetch job roles", 500);
    }
  }

  async updateJobRole(id, jobRoleData) {
    try {
      const updatedJobRole = await JobRole.findByIdAndUpdate(id, jobRoleData, {
        new: true,
        runValidators: true,
      }).populate([
        { path: "category", select: "name" },
        { path: "skills", select: "name" },
        { path: "createdBy", select: "name email" },
        { path: "clientId", select: "name email company" },
      ]);

      if (!updatedJobRole) {
        throw new AppError("Job role not found", 404);
      }

      return updatedJobRole;
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError(
          "Job role with this title already exists for this client",
          409,
        );
      }
      throw error instanceof AppError
        ? error
        : new AppError("Failed to update job role", 500);
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
            as: "category",
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
          $unwind: { path: "$category", preserveNullAndEmptyArrays: false },
        },
        { $sort: { createdAt: -1 } },
      ];
      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch (error) {
      throw new AppError("Failed to fetch client job roles", 500);
    }
  }

  async findJobRolesByCategory(categoryId, page, limit, userId) {
    const now = new Date();

    const pipeline = [
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
          $or: [{ expiry: { $exists: false } }, { expiry: { $gte: now } }],
        },
      },
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
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
          pipeline: [{ $project: { name: 1, email: 1, company: 1 } }],
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
        $project: {
          applications: 0,
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
    ];

    return await paginateAggregation(JobRole, pipeline, { page, limit });
  }

  async findJobRolesBySearch({
    q,
    location,
    jobType,
    requiredExperience,
    minSalary,
    maxSalary,
    category,
    page,
    limit,
    userId,
  }) {
    console.log({
      q,
      location,
      jobType,
      requiredExperience,
      minSalary,
      maxSalary,
      category,
      page,
      limit,
    });

    try {
      console.log("EXPERIENCE FILTER:", requiredExperience);
      const pipeline = [];
      const now = new Date();
      const matchStage = { $and: [] };

      // Active jobs
      matchStage.$and.push({
        $or: [{ expiry: { $exists: false } }, { expiry: { $gte: now } }],
      });

      // Keyword — special chars escape
      if (q) {
        const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchStage.$and.push({
          title: { $regex: escapedQ, $options: "i" },
        });
      }

      // ✅ FIX: Location — "Mumbai, Maharashtra" → sirf "Mumbai" extract karo
      if (location) {
        const cityOnly = location.split(",")[0].trim();
        const escapedLocation = cityOnly.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchStage.$and.push({
          $or: [
            { "location.city": { $regex: escapedLocation, $options: "i" } },
            { "location.state": { $regex: escapedLocation, $options: "i" } },
            { "location.country": { $regex: escapedLocation, $options: "i" } },
          ],
        });
      }

      // Job type
      if (jobType && jobType.length > 0) {
        const jobTypeArray = Array.isArray(jobType)
          ? jobType
          : jobType.split(",");

        const filteredJobType = jobTypeArray
          .map((j) => j.toLowerCase().replace("-", "").trim())
          .filter(Boolean);

        if (filteredJobType.length > 0) {
          matchStage.$and.push({
            $expr: {
              $in: [
                {
                  $replaceAll: {
                    input: { $toLower: "$jobType" },
                    find: "-",
                    replacement: "",
                  },
                },
                filteredJobType,
              ],
            },
          });
        }
      }

      // Experience
      if (Array.isArray(requiredExperience) && requiredExperience.length > 0) {
        console.log("EXPERIENCE FILTER:", requiredExperience);

        const ranges = [];

        requiredExperience.forEach((exp) => {
          switch (exp) {
            case "Entry":
              ranges.push({ requiredExperience: { $lte: 1 } });
              break;
            case "Mid":
              ranges.push({ requiredExperience: { $gte: 2, $lte: 4 } });
              break;
            case "Senior":
              ranges.push({ requiredExperience: { $gte: 5 } });
              break;
          }
        });

        if (ranges.length > 0) {
          matchStage.$and.push({ $or: ranges });
        }
      }

      // Salary
      if (typeof minSalary === "number" && typeof maxSalary === "number") {
        matchStage.$and.push({
          salary: { $exists: true },
          "salary.min": { $gte: minSalary },
          "salary.max": {
            $lte: maxSalary === 99 ? Number.MAX_SAFE_INTEGER : maxSalary,
          },
        });
      }

      // Category
      if (category) {
        matchStage.$and.push({
          category: new mongoose.Types.ObjectId(category),
        });
      }

      pipeline.push({ $match: matchStage });

      // Applications
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
      );

      // Client
      pipeline.push(
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { company: 1, name: 1, email: 1 } }],
          },
        },
        { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      );

      // Category
      pipeline.push({
        $lookup: {
          from: "jobcategories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      });

      // Skills
      pipeline.push({
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills",
        },
      });

      // Final projection
      pipeline.push({
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          jobType: 1,
          requiredExperience: 1,
          location: 1,
          salary: 1,
          skills: 1,
          category: 1,
          createdBy: 1,
          client: 1,
          expiry: 1,
          createdAt: 1,
          applied: 1,
        },
      });

      pipeline.push({ $sort: { createdAt: -1 } });

      console.log("JOB SEARCH MATCH STAGE ↓");
      console.log(JSON.stringify(matchStage, null, 2));

      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch (error) {
      throw new AppError("Failed to fetch jobs.", 500);
    }
  }

  async getJobCountByCategory() {
    const now = new Date();

    const pipeline = [
      {
        $match: {
          $or: [{ expiry: { $exists: false } }, { expiry: { $gte: now } }],
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobcategories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: "$category.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ];

    return await JobRole.aggregate(pipeline);
  }
}

export default MongoJobRoleRepository;
