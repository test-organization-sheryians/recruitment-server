import IJobCategoryRepository from "../contracts/IJobCategoryRepository.js";
import JobCategory from "../../models/jobCategory.model.js";
import { paginateAggregation } from "../../utils/pagination.util.js";

class MongoJobCategoryRepository extends IJobCategoryRepository {
  async create(categoryData) {
    try {
      const category = new JobCategory(categoryData);
      return await category.save();
    } catch (err) {
      if (err.code === 11000) {
        throw { status: 400, message: "Category name already exists" };
      }
      throw err;
    } 
  }

  async findById(id) {
    return await JobCategory.findById(id);
  }

  async findByName(name) {
    return await JobCategory.findOne({ name });
  }

async findAll(page = 1, limit = 10) {
  const pipeline = [
    {
      $lookup: {
        from: "jobroles",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$category", "$$categoryId"],
              },
              $or: [
                { expiry: { $exists: false } },
                { expiry: { $gte: new Date() } },
              ],
            },
          },
        ],
        as: "activeJobs",
      },
    },
    {
      $addFields: {
        jobCount: { $size: "$activeJobs" },
      },
    },
    {
      $project: {
        activeJobs: 0,
      },
    },
    { $sort: { name: 1 } },
  ];

  return await paginateAggregation(JobCategory, pipeline, { page, limit });
}


  async updateById(id, updateData) {
    try {
      const updated = await JobCategory.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      return updated;
    } catch (err) {
      if (err.code === 11000) {
        throw { status: 400, message: "Category name already exists" };
      }
      throw err;
    }
  }

  async deleteById(id) {
    return await JobCategory.findByIdAndDelete(id);
  }
}

export default MongoJobCategoryRepository;
