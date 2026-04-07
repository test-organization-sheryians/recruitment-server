import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";
import IProductRepository from "../contracts/IProductRepository.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      throw new AppError("Failed to create product", 500);
    }
  }

  async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new AppError("Failed to fetch products", 500);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new AppError("Invalid product ID", 400);
    }
  }

  async updateProduct(id, data) {
    try {
      return await Product.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new AppError("Failed to update product", 500);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete product", 500);
    }
  }
}

export default MongoProductRepository;
