import mongoProductRepository from "../repositories/implementations/mongoProductsRepository.js";
import { AppError } from "../utils/errors.js";

class productservice {
  constructor() {
    this.productRepository = mongoProductRepository;
  }

  async createProduct(productData) {
    let existingproduct = this.getsingleProuct({ name: productData.name });
    if (existingproduct) {
      throw new AppError(`Product with this name already exists`, 400);
    }
    return await this.productRepository.createProduct(productData);
  }

  async getallProduct() {
    return await this.productRepository.getallProduct();
  }
  async getsingleProuct(id) {
    return this.productRepository.getsingleProuct(id);
  }
  async updateProduct(id, newdata) {
    let product = this.productRepository.getsingleProuct(id);
    if (!product) {
      throw new AppError(`Product is not found`, 404);
    }
    return await this.productRepository.updateProduct(id, newdata);
  }
  async deleteProduct(id) {
    return await this.productRepository.deleteProduct(id);
  }
}

export default productservice;
