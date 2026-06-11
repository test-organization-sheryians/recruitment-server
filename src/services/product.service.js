import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
  }

  async createProduct(productData) {
    if (productData.price <= 0) {
      throw new AppError("Price must be greater than 0", 400);
    }

    const products = await this.productRepository.findAllProducts();

    const existingProduct = products.find(
      (product) =>
        product.name &&
        product.name.toLowerCase() === productData.name.toLowerCase(),
    );

    if (existingProduct) {
      throw new AppError("Product already exists", 409);
    }

    return await this.productRepository.createProduct(productData);
  }

  async getAllProducts() {
    return await this.productRepository.findAllProducts();
  }

  async getProductById(id) {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(id, productData) {
    if (productData.price && productData.price <= 0) {
      throw new AppError("Price must be greater than 0", 400);
    }

    const product = await this.productRepository.updateProduct(id, productData);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.deleteProduct(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
}

export default ProductService;
