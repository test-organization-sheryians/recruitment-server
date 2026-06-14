

import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
  }

  async createProduct(productData) {
    return await this.productRepository.createProduct(productData);
  }

  async getAllProducts() {
    return await this.productRepository.findAllProducts();
  }

  async getProductById(productId) {
    const product = await this.productRepository.findProductById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(productId, productData) {
    const existingProduct =
      await this.productRepository.findProductById(productId);

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    return await this.productRepository.updateProduct(
      productId,
      productData
    );
  }

  async deleteProduct(productId) {
    const existingProduct =
      await this.productRepository.findProductById(productId);

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    await this.productRepository.deleteProduct(productId);
  }
}

export default ProductService;