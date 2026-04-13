import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
  }

  async createProduct(data) {
    const { name, price, category } = data;

    if (!name || !price || !category) {
      throw new AppError("Name, price and category are required", 400);
    }

    return await this.productRepository.createProduct(data);
  }

  async getAllProducts() {
    return await this.productRepository.getAllProducts();
  }

  async getProductById(id) {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(id, data) {
    const product = await this.productRepository.updateProduct(id, data);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.deleteProduct(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
}

export default ProductService;