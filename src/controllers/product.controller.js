import { MongoProductRepository } from '../repositories/implementations/mongoProductRepository.js';
import { ProductService } from '../services/product.service.js';

const productRepository = new MongoProductRepository();
const productService = new ProductService(productRepository);

export class ProductController {
  static async create(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      return res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      return res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
