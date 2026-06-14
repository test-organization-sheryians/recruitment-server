import IProductRepository from "../contracts/IProductRepository.js";
import { Product } from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(productData) {
    try {
      const product = new Product(productData);

      return await product.save();
    } catch (error) {
      throw new AppError(
        `Failed to create product: ${error.message}`,
        500
      );
    }
  }


  async findAllProducts() {
    try {
      return await Product.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new AppError(
        `Failed to fetch products: ${error.message}`,
        500
      );
    }
  }

   async findProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      throw new AppError(
        `Failed to fetch product: ${error.message}`,
        500
      );
    }
  }

  async updateProduct(productId, productData) {
    try {
      return await Product.findByIdAndUpdate(
        productId,
        { $set: productData },
        { new: true }
      );
    } catch (error) {
      throw new AppError(
        `Failed to update product: ${error.message}`,
        500
      );
    }
  }
  async deleteProduct(productId) {
    try {
      return await Product.findByIdAndDelete(productId);
    } catch (error) {
      throw new AppError(
        `Failed to delete product: ${error.message}`,
        500
      );
    }
  }
}

export default MongoProductRepository;