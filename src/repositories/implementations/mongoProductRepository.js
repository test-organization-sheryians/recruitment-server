import IProductRepository from "../contracts/IProductRepository.js";
import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoProductRepository extends IProductRepository {
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new AppError("Failed to create product", 500);
    }
  }

  async findProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }

    try {
      return await Product.findById(id).lean();
    } catch (error) {
      throw new AppError("Failed to find product", 500);
    }
  }

  async findProductByName(name) {
    try {
      return await Product.findOne({
        name: name.toLowerCase().trim(),
      }).lean();
    } catch (error) {
      throw new AppError("Failed to find product", 500);
    }
  }

  async findAllProducts() {
    try {
      return await Product.find({})
        .sort({ name: 1 })
        .lean();
    } catch (error) {
      throw new AppError("Failed to fetch products", 500);
    }
  }

  async updateProduct(id, productData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }

    try {
      return await Product.findByIdAndUpdate(
        id,
        {
          ...productData,
          name: productData.name?.toLowerCase().trim(),
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Product name already exists", 409);
      }
      throw new AppError("Failed to update product", 500);
    }
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }

    try {
      return await Product.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new AppError("Failed to delete product", 500);
    }
  }

  async searchProductsByName(name) {
    const query = (name || "").trim();

    if (!query) {
      throw new AppError("Query parameter 'name' is required", 400);
    }

    return await Product.find({
      name: { $regex: query, $options: "i" },
    }).lean();
  }
}

export default MongoProductRepository;