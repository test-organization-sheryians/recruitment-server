import mongoose from "mongoose";
import BlogPostRepository from "../contracts/IBlogPostRepository.js";
import BlogPostModel from "../../models/blogPost.model.js";
import { AppError } from "../../utils/errors.js";

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

    const query = { ...filter };


    if (filter.category) {
      query.category = filter.category;
    }

      return await BlogPostModel.find(query)
      .populate("category", "name")
      .populate("technologies", "name")
      .populate("author")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async count(filter) {
    return await BlogPostModel.countDocuments(filter);
  }

  async searchBlogs(filters, options) {
    const { limit = 10, skip = 0, page = 1 } = options;

    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.technologies?.length) {
      query.technologies = { $in: filters.technologies };
    }

    if (filters.search) {
      query.title = {
        $regex: filters.search,
        $options: "i"
      };
    }

    const blogs = await BlogPostModel
      .find(query)
      .populate("category", "name")
      .populate("technologies", "name")
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
      .populate("author", "firstName lastName email");
  }

  async findBySlug(slug) {
    const blog = await BlogPostModel.findOneAndUpdate(
    { slug: slug },                     
    { $inc: { "stats.views": 1 } },     
    { new: true }                       
  )
  .populate("category", "name")
  .populate("technologies", "name")
  .populate("author");

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
          isPublished: true
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
          publishedAt: 1
        }
      }
    ]);
  }

  async deleteById(id) {
    return await BlogPostModel.findByIdAndDelete(id);
  }
}

export default MongoBlogPostRepository;

