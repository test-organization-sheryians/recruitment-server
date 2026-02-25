import mongoose from "mongoose";
import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository()
  }

  async createProduct(productData) {
    if (!productData.name || !productData.price) {
      throw new AppError("Name and price are required", 400);
    }

    return await this.productRepository.createProduct(productData)
  }


  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("invalid product Id", 400);
    }
    const product = await this.productRepository.findProductById(id)
    if (!product) {
      throw new AppError("Product not found ", 404)
    }
    return product
  }

  async getAllProducts() {
    return await this.productRepository.findAllProducts();
  }


  async updateProduct(id, productData) {
    const product = await this.productRepository.updateProduct(id, productData)
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product
  }
  async deleteProduct(id) {
    const product = await this.productRepository.deleteProduct(id)
    if (!product) {
      throw new AppError("Product not found ", 404)
    }
    return product
  }
}

export default ProductService