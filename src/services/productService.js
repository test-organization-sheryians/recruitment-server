import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
	constructor() {
		this.productRepository = new MongoProductRepository();
	}

	async createProduct(data) {
		if (!data.name) {
			throw new AppError("Product name is required", 400);
		}

		if (!data.price) {
			throw new AppError("Price is required", 400);
		}

		return await this.productRepository.createProduct(data);
	}

	async getAllProducts() {
		return await this.productRepository.getAllProducts();
	}

	async getProductById(productId) {
		if (!productId) {
			throw new AppError("Product id is required", 400);
		}

		const product = await this.productRepository.getProductById(productId);

		if (!product) {
			throw new AppError("Product not found", 404);
		}

		return product;
	}

	async updateProduct(productId, data) {
		if (!productId) {
			throw new AppError("Product id is required", 400);
		}

		const updated = await this.productRepository.updateProduct(productId, data);

		if (!updated) {
			throw new AppError("Product not found", 404);
		}

		return updated;
	}

	async deleteProduct(productId) {
		if (!productId) {
			throw new AppError("Product id is required", 400);
		}

		const deleted = await this.productRepository.deleteProduct(productId);

		if (!deleted) {
			throw new AppError("Product not found", 404);
		}

		return deleted;
	}
}

export default ProductService;
