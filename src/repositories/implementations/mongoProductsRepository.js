import productModel from "../../models/product.js";
import IProductsRepository from "../contracts/IProductsRepository.js";
import { AppError } from "../../utils/errors.js";

class mongoProductRepository extends IProductsRepository {
  async createProduct(productData) {
    try {
      let product = new productModel(productData);
      let saveprodct = await product.save();
      return saveprodct;
    } catch (error) {
      console.log("error while creating product ", error);
      throw new AppError(
        `error while creating product :${error.message} `,
        500,
        error,
      );
    }
  }

  async getallProduct() {
    try {
      let products = await productModel.find();
      return products;
    } catch (error) {
      console.log(`error while get all product`, error);
      throw new AppError(
        `error while get all product ${error.message}`,
        500,
        error,
      );
    }
  }
  async getsingleProuct(id) {
    try {
      let product = await productModel.findById(id);
      return product;
    } catch (error) {
      console.log(` error is while search single product `, error);
      throw new AppError(
        `error while get all product ${error.message}`,
        500,
        error,
      );
    }
  }
  async updateProduct(id, data) {
    try {
      let product = await productModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return product;
    } catch (error) {
      console.log(`error is while update product ${error.message}`, error);
      throw new AppError(
        `error while get all product ${error.message}`,
        500,
        error,
      );
    }
  }
  async deleteProduct(id) {
    try {
      let product = await productModel.findByIdAndDelete(id);
      return product;
    } catch (error) {
      console.log(` error is while search single product `, error);
      throw new AppError(
        `error while get all product ${error.message}`,
        500,
        error,
      );
    }
  }
}

export default mongoProductRepository;
