import ProductRepository from "../contracts/IProductRepository.js";
import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends ProductRepository {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      throw new AppError("Failed to create product in database", 500);
    }
  }

  async findProductsByUserId(userId) {
    try {
      return await Product.find({ user: userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new AppError("Failed to fetch products for user", 500);
    }
  }

  async findProductById(id) {
    try {
      return await Product.findById(id).populate("user", "firstName lastName email");
    } catch (error) {
      throw new AppError("Failed to fetch product by ID", 500);
    }
  }

  async updateProductById(id, data) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new AppError("Failed to update product in database", 500);
    }
  }

  async deleteProductById(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete product from database", 500);
    }
  }
}

export default MongoProductRepository;
