import mongoose from "mongoose";
import ProductService from "../services/product.service.js";
import { AppError } from "../utils/errors.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  create = async (req, res, next) => {
    try {
      const productData = req.body;
console.log(productData);

      const result = await this.productService.create(productData);
      res.status(201).json({
        success: true,
        product: result,
        message: "Product created successfully!",
      });
    } catch (error) {
      console.log("error in product create:", error);
      next(error);
    }
  };

  getProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new AppError("Invalid product id", 400);
      const result = await this.productService.getProduct(id);
      if (!result) throw new AppError("Product not found", 404);
      return res.status(200).json({
        success: true,
        product: result,
        message: "Product found",
      });
    } catch (error) {
      console.log("error in fetching product", error);
      next(error);
    }
  };
  getAllProducts = async (req, res, next) => {
    try {
        const result = await this.productService.getAllProducts();
      return res.status(200).json({
       success: true,
      products: result || [],
      message: result?.length
        ? "Products fetched"
        : "No products found",
      });
    } catch (error) {
      console.log("error in fetching products", error);
      next(error);
    }
  };
  updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
        throw new AppError("Invalid product id", 400);
      const data = req.body;

        const result = await this.productService.updateProduct(id, data);
         if (!result) throw new AppError("Product not found", 404);
      return res.status(200).json({
        success: true,
        product: result,
        message: "products update",
      });
    } catch (error) {
      console.log("error in Updating products", error);
      next(error);
    }
  };
  deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
        throw new AppError("Invalid product id", 400);
        const result = await this.productService.deleteProduct(id);
        if (!result) throw new AppError("Product not deleted", 404);
        
      res.status(200).json({
        success: true,
        message: "products deleted",
      });
    } catch (error) {
      console.log("error in deleting product", error);
      next(error);
    }
  };
}
export default new ProductController();
