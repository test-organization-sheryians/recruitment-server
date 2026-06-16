import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
  }

  async create(productData) {
    //findexisted product
    const { name } = productData;
    const existedProduct = await this.productRepository.existedProduct(name);

    if (existedProduct) throw new AppError("Product already exists", 409);
    return await this.productRepository.create(productData);
  }

  async getProduct(id) {
    const product = await this.productRepository.getProduct(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
  async getAllProducts() {
    let result = await this.productRepository.getAllProducts();
    return result || [];
  }

  async updateProduct(id, data) {
    let result = await this.productRepository.updateProduct(id, data);
    if (!result) throw new AppError("failed to update product", 404);
    return result;
  }
  async deleteProduct(id) {
    let result = await this.productRepository.deleteProduct(id);
    if (!result) throw new AppError("failed to delete product", 404);
    return result;
  }
}
export default ProductService;
