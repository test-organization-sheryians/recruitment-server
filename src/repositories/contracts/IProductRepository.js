export class IProductRepository {
	async createProduct(productData) {
		throw new Error("Method 'createProduct' must be implemented.");
	}

	async getAllProducts() {
		throw new Error("Method 'getAllProducts' must be implemented.");
	}

	async getProductById(productId) {
		throw new Error("Method 'getProductById' must be implemented.");
	}

	async updateProduct(productId, updateData) {
		throw new Error("Method 'updateProduct' must be implemented.");
	}

	async deleteProduct(productId) {
		throw new Error("Method 'deleteProduct' must be implemented.");
	}
}

export default IProductRepository;
