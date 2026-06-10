import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import IProductRepository from "../contracts/IProductRepository.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      throw new AppError("Failed to create product", 500);
    }
  }

  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product ID", 400);
    }
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      throw new AppError("Failed to find product", 500);
    }
  }
  //   async getAllProducts() {
  //     try {
  //       return await Product.findOne({ name: name.toLowerCase().trim() }).lean();
  //     } catch (error) {
  //       throw new AppError("Failed to find product", 500);
  //     }
  //   }
  async getAllProducts() {
    try {
      return await Product.find({}, { name: 1 }).sort({ name: 1 }).lean();
    } catch (error) {
      throw new AppError("Failed to fetch product", 500);
    }
  }
  async updateProduct(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product ID", 400);
    }
    try {
      return await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).lean();
      
    } catch (error) {
      throw new AppError("Failed to update product", 500);
    }
  }
  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product ID", 400);
    }
    try {
      return await Product.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new AppError("Failed to delete Product", 500);
    }
  }
}

export default MongoProductRepository;
