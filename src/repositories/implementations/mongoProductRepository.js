import mongoose from "mongoose";
import IProductRepository from "../contracts/IProductRepository.js";
import { productModel } from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

class MongoProductRepository extends IProductRepository {

  async createProduct(productData) {
    try {
      const product = new productModel(productData)
      return await product.save();

    } catch (error) {
      throw new AppError(`Failed to create product : ${error.message}`, 500)
    }
  }

  async findProductById(id) {
    try {
      return await productModel.findById(id)
    } catch (error) {
      throw new AppError(`Falied to featch products : ${error.message} ,500`)
    }
  }

  async findAllProducts() {
    try {
      return await productModel.find().sort({ createdAt: -1 })

    }
    catch (error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }
  }

  async updateProduct(id, productData) {
    try {
      return await productModel.findByIdAndUpdate(id,
        { $set: productData },
        { new: true }
      )
    } catch (error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }
  }

  async deleteProduct(id) {
    try {

      return await productModel.findByIdAndDelete(id)

    } catch (error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }
  }

}

export default MongoProductRepository