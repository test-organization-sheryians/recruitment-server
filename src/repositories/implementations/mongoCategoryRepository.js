import ICategoryRepository from "../contracts/ICategoryRepository.js";
import Category from "../../models/category.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoCategoryRepository extends ICategoryRepository {
  async createCategory(data) {
    try {
      const category = new Category(data);
      return await category.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Category already exists", 409);
      }
      throw new AppError("Failed to create category", 500);
    }
  }

  async findCategoryById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Category ID", 400);
    }
    return Category.findById(id).lean();
  }

  async findCategoryByName(name) {
    return Category.findOne({ name: name.toLowerCase().trim() }).lean();
  }

  async findAllCategories() {
    return Category.find().lean();
  }

  async updateCategory(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Category ID", 400);
    }
    return Category.findByIdAndUpdate(
      id,
      { name: data.name.toLowerCase().trim() },
      { new: true, runValidators: true }
    ).lean();
  }

  async deleteCategory(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Category ID", 400);
    }
    return Category.findByIdAndDelete(id).lean();
  }

  
}

export default MongoCategoryRepository;
