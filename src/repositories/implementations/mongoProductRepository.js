import mongoose from "mongoose";
import ProductsModel from "../../models/products.model.js";
import { AppError } from "../../utils/errors.js";
import IProductRepository from "../contracts/IProductRepository.js";
import { paginateAggregation } from "../../utils/pagination.util.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(data) {
    try {
      const product = new ProductsModel(data);
      return await product.save();
    } catch (error) {
      throw new AppError("Failed to create product", 500);
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await ProductsModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ProductsModel.countDocuments();

      // found this later in code base... but this has some problem not working properly that's why not used this
      //   const result = paginateAggregation(ProductsModel, [], { pate, limit });

      return {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      //   return result;
    } catch (error) {
      throw new AppError("Failed to fetch all products", 500);
    }
  }

  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Product Id is now valid", 400);
    }

    try {
      const product = await ProductsModel.findById(id).lean();
      //   if (!product) throw new AppError("Product now found", 404);
      return product;
    } catch (error) {
      throw new AppError("Failed to fetch product by Id", 400);
    }
  }

  async updateProduct(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Product Id is now valid", 400);
    }

    try {
      const updated = await ProductsModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      //   if (!updated) throw new AppError("Product not found", 500);

      return updated;
    } catch (error) {
      throw new AppError("Failed to update product", 500);
    }
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Product Id is now valid", 400);
    }

    try {
      const deleted = await ProductsModel.findByIdAndDelete(id).lean();
      //   if (!deleted) throw new AppError("Product not found", 404);
      return deleted;
    } catch (error) {
      throw new AppError("Failed to delete product", 500);
    }
  }
}

export default MongoProductRepository;
