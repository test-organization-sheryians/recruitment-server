import { Router } from "express";
import BlogPostController from "../controllers/blogPost.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { createBlogPostSchema } from "../middlewares/validators/blogPost.validator.js";
import { blogListQuerySchema } from "../middlewares/validators/blogPost.query.validator.js";
import { updateBlogPostSchema } from "../middlewares/validators/blogPost.validator.js";
import { searchBlogSchema } from "../middlewares/validators/blogPost.validator.js";

const router = Router();

router.use(authenticateJWT);

const blogPostController = new BlogPostController();




router.get(
  "/",
  validateRequest(blogListQuerySchema, "query"),
  blogPostController.getBlogPosts
);


router.get("/slug/:slug", blogPostController.getBlogPostBySlug);


router.get("/:id", blogPostController.getBlogPostById);




router.post(
  "/",
  authorizeRoles("admin"),
  validateRequest(createBlogPostSchema),
  blogPostController.createBlogPost
);

 router.post(
  "/search",
  validateRequest(searchBlogSchema),
  blogPostController.searchBlogs

);

router.patch(
  "/:id",
  authorizeRoles("admin"),
  validateRequest(updateBlogPostSchema),
  blogPostController.updateBlogPost
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  blogPostController.deleteBlogPost
);

export default router;