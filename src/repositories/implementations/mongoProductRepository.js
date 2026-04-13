import { tryCatch } from "bullmq";
import Product from "../../models/product.model.js";
import IProductRepository from "../contracts/IProductRepository.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(data) {
    try {
      return await Product.create(data);
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  }

  async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error("Error fetching product: " + error.message);
    }
  }

  async updateProduct(id, data) {
    try {
      return await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  }
}

export default MongoProductRepository;
