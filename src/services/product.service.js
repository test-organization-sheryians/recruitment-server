import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
  }

  async createProduct(data) {
    if (!data.title || !data.description || !data.price?.amount) {
      throw new AppError("Required fields are missing", 400);
    }

    data.title = data.title.trim();
    data.category = data.category?.toLowerCase();

    return await this.productRepository.createProduct(data);
  }

  async getAllProducts(query) {
    return await this.productRepository.getProduct(query);
  }

  async getProductById(id) {
    if (!id) throw new AppError("Product ID is required", 400);

    const product = await this.productRepository.getProductById(id);

    if (!product) throw new AppError("Product not found", 404);

    return product;
  }

  async updateProduct(id, data) {
    const existing = await this.productRepository.getProductById(id);
    if (!existing) throw new AppError("Product not found", 404);

    if (data.title) data.title = data.title.trim();
    if (data.category) data.category = data.category.toLowerCase();

    return await this.productRepository.updateProductById(id, data);
  }

  async deleteProduct(id) {
    const existing = await this.productRepository.getProductById(id);
    if (!existing) throw new AppError("Product not found", 404);

    await this.productRepository.deleteProductById(id);

    return { message: "Product deleted successfully" };
  }
}

export default ProductService;