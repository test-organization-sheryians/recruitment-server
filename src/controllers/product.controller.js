import productService from "../services/product.service.js";

class ProductController {
  create = async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);
      return res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const products = await productService.getAllProducts();
      return res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      return res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body,
      );
      return res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      return res.json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();