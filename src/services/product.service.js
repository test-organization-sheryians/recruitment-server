import { AppError } from "../utils/errors.js";

class ProductService {
  constructor(productRepo) {
    this.productRepo = productRepo; // ✅ dependency injection
  }

  async createProduct(data) {
    // ✅ basic validation at service level (optional safety)
    if (!data || !data.title || !data.price) {
      throw new AppError("Invalid product data", 400);
    }

    return await this.productRepo.createProduct(data);
  }

  async getAllProducts() {
    return await this.productRepo.getAllProducts();
  }

  async getProductById(id) {
    const product = await this.productRepo.getProductById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(id, data) {
    const product = await this.productRepo.updateProduct(id, data);

    if (!product) {
      throw new AppError("Product not found", 404); // ✅ fixed typo
    }

    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepo.deleteProduct(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
}

export default ProductService;
