import mongoose from 'mongoose';
import { IProductRepository } from '../contracts/IProductRepository.js';
import { Product } from '../../models/product.model.js';
import { AppError } from '../../utils/errors.js';

export class MongoProductRepository extends IProductRepository {
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async findAll() {
    try {
      return await Product.find({});
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async findById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid product ID format', 400);
      }
      const objectId = new mongoose.Types.ObjectId(id);
      const results = await Product.aggregate([
        { $match: { _id: objectId } },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            stock: 1,
            category: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ]);
      if (!results || results.length === 0) {
        throw new AppError('Product not found', 404);
      }
      return results[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message, 500);
    }
  }

  async updateProduct(id, productData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid product ID format', 400);
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true
      });
      if (!updatedProduct) {
        throw new AppError('Product not found', 404);
      }
      return updatedProduct;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message, 400);
    }
  }

  async deleteProduct(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid product ID format', 400);
      }
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new AppError('Product not found', 404);
      }
      return deletedProduct;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message, 500);
    }
  }
}
