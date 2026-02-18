import MongoCategoryRepository from "../repositories/implementations/mongoCategoryRepository.js";
import { AppError } from "../utils/errors.js";

const categoryRepo = new MongoCategoryRepository();

class CategoryService {
  async createCategory(data) {
    const existing = await categoryRepo.findCategoryByName(data.name);
    if (existing) {
      throw new AppError("Category already exists", 409);
    }
    return categoryRepo.createCategory(data);
  }

  async getCategoryById(id) {
    const category = await categoryRepo.findCategoryById(id);
    
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  }

  async getAllCategories() {
    return categoryRepo.findAllCategories()
  }

  async updateCategory(id, data) {
    const updated = await categoryRepo.updateCategory(id, data);
    if (!updated) {
      throw new AppError("Category not found", 404);
    }
    return updated;
  }

  async deleteCategory(id) {
    const deleted = await categoryRepo.deleteCategory(id);
    if (!deleted) {
      throw new AppError("Category not found", 404);
    }
    return deleted;
  }

 
}

export default new CategoryService();
