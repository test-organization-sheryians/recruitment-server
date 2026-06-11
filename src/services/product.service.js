import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
  }

  async createProduct(data) {
    const existingProduct = await this.productRepository.findProduct({
      title: data.title,
    });

    if (existingProduct && existingProduct.length > 0) {
      throw new AppError("A product with this title already exists", 409);
    }
    try {
      return await this.productRepository.createProduct(data);
    } catch (error) {
      throw new AppError("Service failed to create product", 500, error);
    }
  }

  async getProductById(id) {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  }

  async getProductByCategory(category) {
    return await this.productRepository.findProductByCategory(category);
  }

  async getProduct(query) {
    try {
      return await this.productRepository.findProduct(query);
    } catch (error) {
      throw new AppError("Service failed to fetch products", 500, error);
    }
  }

  async updateProduct(id, data) {
    const updated = await this.productRepository.updateProduct(id, data);
    if (!updated) {
      throw new AppError("Product not found or update failed", 404);
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await this.productRepository.deleteProduct(id);
    if (!deleted) {
      throw new AppError("Product not found or delete failed", 404);
    }
    return deleted;
  }
}

export default ProductService;
