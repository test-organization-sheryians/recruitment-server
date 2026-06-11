import IProductRepository from "../contracts/IProductRepository.js";
import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoProductRepository extends IProductRepository {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      throw new AppError("Failed to create product", 500);
    }
  }

  async findProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }
    return Product.findById(id).lean();
  }

  async findAllProducts({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [data, totalRecords] = await Promise.all([
      Product.find().skip(skip).limit(limit).lean(),
      Product.countDocuments(),
    ]);
    return {
      data,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async updateProduct(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Product ID", 400);
    }
    return Product.findByIdAndDelete(id).lean();
  }
}

export default MongoProductRepository;
