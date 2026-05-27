import productModel from '../models/product.model.js';
import MongoProductRepository from '../repositories/implementations/mongoProductRepository.js';
import { AppError } from '../utils/errors.js';

class productService {
    constructor() {
        this.productRepository = new MongoProductRepository();
    }

    async createProduct(productData) {
        let existingProduct = await productModel.findOne({ name: productData.name });
        if (existingProduct) {
            throw new AppError("Product with this name already exists", 400);
        }
        console.log("your product data in services is", productData);
        return await this.productRepository.create(productData);
    }

    async getAllProducts(filter = {}) {
        return await this.productRepository.findAll(filter);
    }

    async getSingleProduct(id) {
        let product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError("product not found", 404);
        }
        return product;
    }

    async getProductsByCategory(categoryId) {
        return await this.productRepository.findByCategory(categoryId);
    }

    async updateProduct(id, newData) {
        let product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError('product not found', 404);
        }
        return await this.productRepository.updateById(id, newData);
    }

    async deleteProduct(id) {
        return await this.productRepository.deleteById(id);
    }
}

export default productService;