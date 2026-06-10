import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

const productRepo = new MongoProductRepository();

class productService {
  async createProduct(data) {
    return await productRepo.createProduct(data);
  }

  async getProductById(id) {
    const product = await productRepo.getProductById(id);
    if (!product) {
      throw new AppError("product not found", 404);
    }
    return product;
  }

  async getAllProducts() {
    return await productRepo.getAllProducts();
  }

  async updateProduct(id, data) {
    const updated = await productRepo.updateProduct(id, data);
    if (!updated) {
      throw new AppError("product not found or update failed", 404);
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepo.deleteProduct(id);
    if (!deleted) {
      throw new AppError("product not found or delete failed", 404);
    }
    return deleted;
  }
}

export default new productService();
