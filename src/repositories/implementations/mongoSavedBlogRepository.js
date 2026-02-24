import ISavedBlogRepository from "../contracts/ISavedBlogRepository.js";
import SavedBlog from "../../models/savedBlog.model.js";
import { AppError } from "../../utils/errors.js";

class MongoSavedBlogRepository extends ISavedBlogRepository {

  async save(data) {
    try {
      const saved = new SavedBlogModel(data);
      return await saved.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Blog already saved", 409);
      }
      throw new AppError("Failed to save blog", 500);
    }
  }

  async findPaginated(filter, skip, limit) {
    return await SavedBlog.find(filter)
      .populate({
        path: "blogId",
        select: "title slug subtitle hero readingTime stats"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async count(filter) {
    return await SavedBlog.countDocuments(filter);
  }

  async delete(filter) {
    return await SavedBlog.findOneAndDelete(filter);
  }

  async findOne(filter) {
    return await SavedBlog.findOne(filter);
  }
}

export default MongoSavedBlogRepository;