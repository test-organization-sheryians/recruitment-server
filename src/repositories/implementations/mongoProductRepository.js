import mongoose from "mongoose";
import IProductRepository from "../contracts/IProductRepository.js";
import ProductModel from "../../models/product.model.js";
import {AppError} from "../../utils/errors.js"


class mongoProductRepository extends IProductRepository {

  async createProduct(productData) {
    try {
      const product = new ProductModel(productData);
      return await product.save();
    } catch (error) {
      throw new ApiError(
        `Failed to create product: ${error.message}`,
        500,
        error
      );
    }
  }

//   async findProductById(id) {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return null;
//       }

//       return await Product.findById(id);
//     } catch (error) {
//       throw new AppError(
//         "Failed to find product by ID",
//         500,
//         error
//       );
//     }
//   }

  async updateProduct(id, productData) {
    try {
      return await ProductModel.findByIdAndUpdate(
        id,
        productData,
        { new: true }
      );
    } catch (error) {
      throw new ApiError(
        "Failed to update product",
        500,
        error
      );
    }
  }

  async deleteProduct(id) {
    try {
      return await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      throw new ApiError(
        "Failed to delete product",
        500,
        error
      );
    }
  }
}

export default mongoProductRepository;
