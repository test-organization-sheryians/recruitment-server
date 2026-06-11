import IProductRepository from "../contracts/IProductRepository.js";
import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      const savedProduct = await product.save();
      return savedProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new AppError(
        `Failed to create product: ${error.message}`,
        500,
        error,
      );
    }
  }

  async findProductByCategory(category) {
    try {
      return await Product.find({ category: category }).lean();
    } catch (error) {
      console.error(`Error finding products by category (${category}):`, error);
      throw new AppError("Failed to fetch products by category", 500, error);
    }
  }

  async findProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        throw new AppError("Product not found", 404);
      }
      return product;
    } catch (error) {
      console.error(`Error finding product by ID (${id}):`, error);
      throw new AppError("Failed to fetch product by ID", 500, error);
    }
  }

  async findProduct(query) {
    try {
      return await Product.find(query).lean();
    } catch (error) {
      console.error("Error executing dynamic product query:", error);
      throw new AppError("Failed to execute product search query", 500, error);
    }
  }

  async updateProduct(id, productData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true },
      ).lean();
    } catch (error) {
      throw new AppError("Failed to update product", 500, error);
    }
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete product", 500, error);
    }
  }
}

export default MongoProductRepository;
