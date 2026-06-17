import ProductService from "../services/product.service.js";
import { successResponse } from "../utils/apiResponse.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req, res, next) => {
    try {
      const product = await this.productService.createProduct({
        ...req.body,
        userId: req.userId,
      });
      successResponse(res, product, "Product created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getProductsByUser = async (req, res, next) => {
    try {
      const targetUserId = req.params.userId || req.userId;
      const products = await this.productService.getProductsByUser(targetUserId);
      successResponse(res, products, "Products retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body,
        req.userId
      );
      successResponse(res, product, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const result = await this.productService.deleteProduct(req.params.id, req.userId);
      successResponse(res, result, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
