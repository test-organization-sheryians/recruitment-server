import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

const productRepo = new MongoProductRepository();

class ProductService {
  async createProduct(data) {
    const existing = await productRepo.findProductByName(data.name);

    if (existing) {
      throw new AppError("Product with this name already exists", 409);
    }

    return await productRepo.createProduct(data);
  }

  async getProductById(id) {
    const product = await productRepo.findProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async getAllProducts() {
    return await productRepo.findAllProducts();
  }

  async updateProduct(id, data) {
    const updated = await productRepo.updateProduct(id, data);

    if (!updated) {
      throw new AppError("Product not found or update failed", 404);
    }

    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepo.deleteProduct(id);

    if (!deleted) {
      throw new AppError("Product not found or delete failed", 404);
    }

    return deleted;
  }

  async searchProductsByName(name) {
    return await productRepo.searchProductsByName(name);
  }
}

export default new ProductService();