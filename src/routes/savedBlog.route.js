import { Router } from "express";
import SavedBlogController from "../controllers/savedBlog.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";

const router = Router();
const savedBlogController = new SavedBlogController();

router.post(
  "/",
  authenticateJWT,
  savedBlogController.saveBlog
);

router.get(
  "/",
  authenticateJWT,
  savedBlogController.getSavedBlogs
);

router.delete(
  "/:blogId",
  authenticateJWT,
  savedBlogController.deleteSavedBlog
);

export default router;