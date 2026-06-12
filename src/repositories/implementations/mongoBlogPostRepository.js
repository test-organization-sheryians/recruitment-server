import mongoose from "mongoose";
import BlogPostRepository from "../contracts/IBlogPostRepository.js";
import BlogPostModel from "../../models/blogPost.model.js";
import { AppError } from "../../utils/errors.js";
import CategoryModel from "../../models/jobCategory.model.js";
import TechnologyModel from "../../models/skill.model.js";
import UserModel from "../../models/user.model.js";
import jobCategoryModel from "../../models/jobCategory.model.js";
import skillModel from "../../models/skill.model.js";

class MongoBlogPostRepository extends BlogPostRepository {



  async create(data) {
    try {
      const blogPost = new BlogPostModel(data);
      return await blogPost.save();

    } catch (error) {

      console.log("BLOG CREATE ERROR:", error);


      if (error.code === 11000) {

        const duplicateField = Object.keys(error.keyValue || {})[0];

        if (duplicateField === "slug") {
          throw new AppError(
            `Slug '${error.keyValue.slug}' already exists`,
            409
          );
        }

        throw new AppError("Duplicate key error", 409);
      }

      throw new AppError("Failed to create blog post", 500);
    }
  }

  async findPaginated(filter, skip, limit) {

    const query = { ...filter}; 
     
      return await BlogPostModel.find(query)
      
      .populate("category", "name")
      .populate("technologies", "name")
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async count(filter) {
    return await BlogPostModel.countDocuments(filter);
  }

   async searchBlogs(filters = {}, options = {}) {
  const { limit = 10, page = 1 } = options;

  

  // Always derive skip from page
  const skip = (page - 1) * limit;

  const query = {
    status: "published" // Only search published blogs

  };

  /* -------------------------------------------------- */
  /* CATEGORY RESOLVER (id / name / slug)               */
  /* -------------------------------------------------- */
 
  if (filters.category) {
    let categoryId = null;

    if (mongoose.isValidObjectId(filters.category)) {
      categoryId = filters.category;
    } else {
      const categoryDoc = await CategoryModel.findOne({
        $or: [
          { name: new RegExp(`^${filters.category}$`, "i") },
          { slug: filters.category }
        ]
      }).select("_id");

      if (categoryDoc) categoryId = categoryDoc._id;
    }

    // If category sent but not found → return empty result
    if (!categoryId) {
      return {
        blogs: [],
        pagination: { total: 0, page, limit }
      };
    }

    query.category = categoryId;
  }

  /* -------------------------------------------------- */
  /* TECHNOLOGY RESOLVER (bulk lookup)                  */
  /* -------------------------------------------------- */

  if (filters.technologies?.length) {
    const techInputs = filters.technologies;

    const objectIds = techInputs.filter(id =>
      mongoose.isValidObjectId(id)
    );

    const namesOrSlugs = techInputs.filter(
      t => !mongoose.isValidObjectId(t)
    );

    let resolvedIds = [...objectIds];

    if (namesOrSlugs.length) {
      const techDocs = await TechnologyModel.find({
        $or: [
          { name: { $in: namesOrSlugs } },
          { slug: { $in: namesOrSlugs } }
        ]
      }).select("_id");

      resolvedIds.push(...techDocs.map(t => t._id));
    }

    if (!resolvedIds.length) {
      return {
        blogs: [],
        pagination: { total: 0, page, limit }
      };
    }

    query.technologies = { $in: resolvedIds };
  }

  /* -------------------------------------------------- */
  /* GLOBAL SEARCH                                      */
  /* -------------------------------------------------- */

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i");

    // Category search match
    const categories = await CategoryModel.find({
      name: searchRegex
    }).select("_id");

    const categoryIds = categories.map(c => c._id);

    // Technology search match
    const technologies = await TechnologyModel.find({
      name: searchRegex
    }).select("_id");

    const techIds = technologies.map(t => t._id);

    query.$or = [
      { title: searchRegex },
      { slug: searchRegex },
      { category: { $in: categoryIds } },
      { technologies: { $in: techIds } }
    ];
  }
  


  /* -------------------------------------------------- */
  /* EXECUTION                                          */
  /* -------------------------------------------------- */

  const blogs = await BlogPostModel.find(query)
    .select(`
      title
      slug
      subtitle
      readingTime
      hero.imageUrl
      category
      technologies
      stats
      seo
      createdAt
      status
     `)
    .populate("category", "name slug")
    .populate("technologies", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await BlogPostModel.countDocuments(query);

  return {
    blogs,
    pagination: {
      total,
      page,
      limit
    }
  };
}


  async findById(id) {

    return await BlogPostModel.findById(id)
      .populate("author", "firstName lastName email")
      .populate("category", "name")
      .populate("technologies", "name")
      .populate("author", "firstName lastName email");


  }

  async findBySlug(slug) {
    const blog = await BlogPostModel.findOneAndUpdate(
    { slug: slug, status: "published" },                     
    { $inc: { "stats.views": 1 } },     
    { new: true }                       
  )
  .populate("category", "name")
  .populate("technologies", "name")
  .populate("author", "firstName lastName email");

  if (!blog) {
    throw new Error("Blog not found");
  }

  return blog;
  }

  async updateById(id, data) {
    try {
      return await BlogPostModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new AppError("Failed to update blog post", 500);
    }
  }

  
  async getTopViewedBlogs() {
    return await BlogPostModel.aggregate([
      {
        $match: {
          status: { $regex: "^published$", $options: "i" }
          

        }
      },
      {
        $sort: {
          "stats.views": -1
        }
      },
      {
        $limit: 4
      },
      {
        $project: {
          title: 1,
          slug: 1,
          subtitle: 1,
          readingTime: 1,
          hero: 1,
          category: 1,
          author: 1,
          "stats.views": 1,
          status: 1,
          publishedAt: 1
        }
      }
    ]);
  }

  async getRecommendedBlogsBySlug(slug, limit = 3) {
  const currentBlog = await BlogPostModel.findOne({
    slug,
    status: "published"
  }).select("category technologies");

  if (!currentBlog) {
    throw new AppError("Blog not found", 404);
  }

  const categoryId = new mongoose.Types.ObjectId(currentBlog.category);
  const techIds = (currentBlog.technologies || []).map(
    id => new mongoose.Types.ObjectId(id)
  );

  const recommended = await BlogPostModel.aggregate([
    {
      $match: {
        slug: { $ne: slug },
        status: "published"
      }
    },
    {
      $addFields: {
        categoryMatch: {
          $cond: [
            { $eq: ["$category", categoryId] },
            1,
            0
          ]
        },
        techMatchCount: {
          $size: {
            $setIntersection: [
              { $ifNull: ["$technologies", []] },
              techIds
            ]
          }
        }
      }
    },
    {
      $addFields: {
        matchScore: {
          $add: ["$categoryMatch", "$techMatchCount"]
        }
      }
    },
    {
      $match: { matchScore: { $gt: 0 } }
    },
    {
      $sort: { matchScore: -1, createdAt: -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        title: 1,
        slug: 1,
        subtitle: 1,
        readingTime: 1,
        "hero.imageUrl": 1,
        category: 1,
        technologies: 1,
        createdAt: 1
      }
    }
  ]);

  await BlogPostModel.populate(recommended, [
    { path: "category", select: "name slug" },
    { path: "technologies", select: "name slug" }
  ]);

  return recommended;
}

  async deleteById(id) {
    return await BlogPostModel.findByIdAndDelete(id);
  }
}

export default MongoBlogPostRepository;

