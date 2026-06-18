import mongoose from "mongoose";
import IProductRepository from "../contracts/IProductRepository.js";
import { Product } from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      throw new AppError(`Failed to create product: ${error.message}`, 500);
    }
  }     

  async getAllProducts() {
    try {
      return await Product.find()
    } catch (error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }
  }

  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product id", 400);
    }

    const product = await Product.findById(id);
    return product || null;
  }

  async updateProduct(id, data) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
    } catch (error) {
      throw new AppError(`Failed to update product: ${error.message}`, 500);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError(`Failed to delete product: ${error.message}`, 500);
    }
  }
}

export default MongoProductRepository;
