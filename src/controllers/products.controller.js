import ProductService from "../services/products.service.js";
import { successResponse } from "../utils/apiResponse.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  create = async (req, res, next) => {
    try {
      const product = await this.productService.createProduct(req.body);

      return successResponse(res, product, "Product created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.validatedQuery || req.query;
      const result = await this.productService.getAllProducts(page, limit);

      return successResponse(
        res,
        result,
        "All products fetched successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await this.productService.getProductById(id);

      return successResponse(res, product, "Product fetched", 200);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;

      const updated = await this.productService.updateProduct(id, req.body);

      return successResponse(res, updated, "Product updated successfully", 200);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleted = await this.productService.deleteProduct(id);

      return successResponse(
        res,
        deleted,
        "This product deleted successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
