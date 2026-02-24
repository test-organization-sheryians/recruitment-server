import mongoose from "mongoose";

const savedBlogSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate save (one user cannot save same blog twice)
savedBlogSchema.index({ blogId: 1, userId: 1 }, { unique: true });

const SavedBlog = mongoose.model("SavedBlog", savedBlogSchema);

export default SavedBlog;