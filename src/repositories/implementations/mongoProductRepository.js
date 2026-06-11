import product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoProductRepository {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Product name already exists", 409);
      }
      throw new AppError("Failed to create product", 500);
    }
  }

  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product id", 400);
    }
    const product = await Product.findById(id).lean();
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  }

  async getAllProducts() {
    return await Product.find().lean();
  }

  async updateProduct(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product id", 400);
    }
    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      throw new AppError("Product not found", 404);
    }
    return updated;
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product id", 400);
    }
    const deleted = await Product.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new AppError("Product not found", 404);
    }
    return deleted;
  }
}

export default new MongoProductRepository();
