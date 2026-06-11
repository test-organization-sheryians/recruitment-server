import productService from "../services/product.service.js";

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const result = await productService.getAllProducts(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updated = await productService.updateProduct(
        req.params.id,
        req.body
      );
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new ProductController();
