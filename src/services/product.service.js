import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
    constructor() {
        this.productRepository = new MongoProductRepository();
    }

    async createProduct(productData) {
        return await this.productRepository.createProduct(productData);
    }

    async getProductById(id) {
        return await this.productRepository.getProductById(id);
    }

    async updateProduct(id, productData) {
        return await this.productRepository.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await this.productRepository.deleteProduct(id);
    }
}
export default ProductService;