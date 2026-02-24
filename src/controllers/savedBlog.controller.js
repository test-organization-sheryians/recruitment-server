import SavedBlogService from "../services/savedBlog.service.js";
import { successResponse } from "../utils/apiResponse.js";

class SavedBlogController {
  constructor() {
    this.savedService = new SavedBlogService();
  }

  saveBlog = async (req, res, next) => {
    try {
      const result = await this.savedService.saveBlog(
        req.userId,
        req.body.blogId
      );

      successResponse(res, result, "Blog saved successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getSavedBlogs = async (req, res, next) => {
    try {
      const options = {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0
      };

      const data = await this.savedService.getAllSavedBlogs(
        req.userId,
        options
      );

      successResponse(res, data, "Saved blogs retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteSavedBlog = async (req, res, next) => {
    try {
      const result = await this.savedService.deleteSavedBlog(
        req.userId,
        req.params.blogId
      );

      successResponse(res, result, "Saved blog deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}

export default SavedBlogController;