import ProductService from "../services/product.service.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();

    this.createProduct = this.createProduct.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.getProductsByCategory = this.getProductsByCategory.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  async createProduct(req, res, next) {
    try {
      const newProduct = await this.productService.createProduct(req.body);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const products = await this.productService.getProductByCategory(category);

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProducts(req, res, next) {
    try {
      const products = await this.productService.getProduct(req.query);

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await this.productService.updateProduct(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProductController();