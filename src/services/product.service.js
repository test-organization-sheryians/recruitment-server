import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

const productRepo = new MongoProductRepository();

class ProductService {
  async createProduct(data) {
    return productRepo.createProduct(data);
  }

  async getProductById(id) {
    const product = await productRepo.findProductById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  }

  async getAllProducts(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    return productRepo.findAllProducts({ page, limit });
  }

  async updateProduct(id, data) {
    const updated = await productRepo.updateProduct(id, data);
    if (!updated) {
      throw new AppError("Product not found", 404);
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepo.deleteProduct(id);
    if (!deleted) {
      throw new AppError("Product not found", 404);
    }
    return deleted;
  }
}

export default new ProductService();
