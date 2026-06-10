import { Product } from "../../models/productModel.js";
import { AppError } from "../../utils/errors.js";
import IProductRepository from "../contracts/IProductRepository.js";


class MongoProductRepository extends IProductRepository {
	async createProduct(data) {
		try {
			const product = await Product.create(data);
			return product;
		} catch (error) {
			throw new AppError("Error creating product: " + error.message, 500);
		}
	}

	async getAllProducts() {
		try {
			return await Product.find();
		} catch (error) {
			throw new AppError("Error fetching products: " + error.message, 500);
		}
	}

	async getProductById(id) {
		try {
			return await Product.findById(id);
		} catch (error) {
			throw new AppError("Error fetching product by ID: " + error.message, 500);
		}
	}

	async updateProduct(id, data) {
		try {
			const updated = await Product.findByIdAndUpdate(id, data, {
				new: true,
			});
			return updated;
		} catch (error) {
			throw new AppError("Error updating product: " + error.message, 500);
		}
	}

	async deleteProduct(id) {
		try {
			return await Product.findByIdAndDelete(id);
		} catch (error) {
			throw new AppError("Error deleting product: " + error.message, 500);
		}
	}
}

export default MongoProductRepository;