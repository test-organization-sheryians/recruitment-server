import { AppError } from "../utils/errors.js";
import MongoSavedBlogRepository from "../repositories/implementations/mongoSavedBlogRepository.js";

class SavedBlogService {
  constructor() {
    this.savedRepo = new MongoSavedBlogRepository();
  }

  async saveBlog(userId, blogId) {

    const existing = await this.savedRepo.findOne({ userId, blogId });
    if (existing) {
      throw new AppError("Blog already saved", 409);
    }

    return await this.savedRepo.save({ userId, blogId });
  }

  async getAllSavedBlogs(userId, options = {}) {
    const { limit = 10, skip = 0 } = options;

    const filter = { userId };

    const [blogs, total] = await Promise.all([
      this.savedRepo.findPaginated(filter, skip, limit),
      this.savedRepo.count(filter)
    ]);

    return {
      blogs,
      pagination: {
        total,
        skip,
        limit,
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    };
  }

  async deleteSavedBlog(userId, blogId) {
    const deleted = await this.savedRepo.delete({ userId, blogId });

    if (!deleted) {
      throw new AppError("Saved blog not found", 404);
    }

    return { success: true, message: "Saved blog removed successfully" };
  }
}

export default SavedBlogService;