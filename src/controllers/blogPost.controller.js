
import BlogPostService from "../services/blogPost.service.js";
import { successResponse } from "../utils/apiResponse.js";

class BlogPostController {
  constructor() {
    this.blogService = new BlogPostService();
  }

  createBlogPost = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.createBlogPost({ ...req.body, author: req.userId });
      successResponse(res, blogPost, "Blog created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getBlogPosts = async (req, res, next) => {
    try {
      const options = req.validatedQuery || {};
      const  type = req.query.type ; 
      const isAdminRoute = req.path.includes("admin");
      const data = await this.blogService.getBlogPosts({...options, isAdminRoute});

      res.status(200).json({
        success: true,
        data,
        message: "Blog posts retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  getTopViewedBlogs = async(req,res,next) => {
    try{
      const data = await this.blogService.getTopViewedBlogs();

      res.status(200).json({
        success: true,
        data,
        message: "Top viewed blog posts retrieved successfully"
      });
      
    }catch(error){
      next(error)
    }
  };

  getRecommendedBlogs = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { limit = 3 } = req.query;

    const blogs = await this.blogService.getRecommendedBlogs(
      slug,
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: blogs,
      message: "Recommended blogs fetched successfully"
    });
  } catch (error) {
    next(error);
  }
};


  searchBlogs = async (req, res, next) => {
    try {
      const filters = req.body;

      const options = {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0,
        page: parseInt(req.query.page) || 1
      };

      const data = await this.blogService.searchBlogs(filters, options);

      res.status(200).json({
        success: true,
        data
      });

    } catch (error) {
      next(error);
    }
  };


  

  getBlogPostById = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.getBlogPostById(req.params.id);
      successResponse(res, blogPost, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getBlogPostBySlug = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.getBlogPostBySlug(req.params.slug);
      successResponse(res, blogPost, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  updateBlogPost = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.updateBlogPost(req.params.id, req.body);
      successResponse(res, blogPost, "Blog updated successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteBlogPost = async (req, res, next) => {
    try {
      const result = await this.blogService.deleteBlogPost(req.params.id);
      successResponse(res, result, "Blog deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}

export default BlogPostController;




