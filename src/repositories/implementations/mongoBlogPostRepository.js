import BlogPostRepository from "../contracts/IBlogPostRepository.js";
import BlogPostModel from "../../models/blogPost.model.js";
import {AppError} from "../../utils/errors.js";

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

  const query = {...filter};

 
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

  async findById(id) {
    return await BlogPostModel.findById(id)
      .populate("author", "firstName lastName email");
  }

  async findBySlug(slug) {
    return await BlogPostModel.findOne({ slug })
      .populate("author", "firstName lastName email");
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



  async deleteById(id) {
    return await BlogPostModel.findByIdAndDelete(id);
  }
}

export default MongoBlogPostRepository;

