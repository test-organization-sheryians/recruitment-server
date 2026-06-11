import IProductRepository from "../contracts/IProductRepository.js";
import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends IProductRepository {
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new AppError(`Failed to create product: ${error.message}`, 500);
    }
  }

  async findAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new AppError("Failed to fetch products", 500);
    }
  }

  async findProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new AppError("Failed to fetch product", 500);
    }
  }

  async updateProduct(id, productData) {
    try {
      return await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
    } catch (error) {
      throw new AppError("Failed to update product", 500);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete product", 500);
    }
  }
}

export default MongoProductRepository;