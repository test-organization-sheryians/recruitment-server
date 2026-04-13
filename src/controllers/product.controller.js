import ProductService from "../services/product.service.js";
import { AppError } from "../utils/errors.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();

    this.createProduct = this.createProduct.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getSingleProduct = this.getSingleProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  createProduct = async (req, res, next) => {
    try {
      const product = await this.productService.createProduct(req.body);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  getAllProducts = async (req, res, next) => {
    try {
      const products = await this.productService.getAllProducts();

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  };

  getSingleProduct = async (req, res, next) => {
    try {
      const product = await this.productService.getProductById(req.params.id);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      await this.productService.deleteProduct(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new ProductController();