import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepo = new MongoProductRepository();
  }

  async createProduct(data) {
    if(!data.name || !data.price || !data.userId){
        throw new AppError("Name and price and user are required", 400);
    }
    const productData = {
      name: data.name,
      description: data.description ?? "",
      price: data.price,
      user: data.userId,
    };
    return await this.productRepo.createProduct(productData);
  }

  async getProductsByUser(userId) {
    return await this.productRepo.findProductsByUserId(userId);
  }

  async updateProduct(productId, data, userId) {
    const product = await this.productRepo.findProductById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.user._id.toString() !== userId.toString()) {
      throw new AppError("Unauthorized: You do not own this product", 403);
    }

    const updates = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.price !== undefined) updates.price = data.price;

    if (Object.keys(updates).length === 0) {
      throw new AppError("No valid fields provided for update", 400);
    }

    return await this.productRepo.updateProductById(productId, updates);
  }

  async deleteProduct(productId, userId) {
    const product = await this.productRepo.findProductById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.user._id.toString() !== userId.toString()) {
      throw new AppError("Unauthorized: You do not own this product", 403);
    }

    await this.productRepo.deleteProductById(productId);
    return { success: true, message: "Product deleted successfully" };
  }
}

export default ProductService;
