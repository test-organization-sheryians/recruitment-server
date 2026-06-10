import productService from "../services/product.service.js";

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const nameQuery = req.query.name;

      const products = await productService.searchProductsByName(nameQuery);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();