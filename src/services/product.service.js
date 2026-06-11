import productRepo from "../repositories/implementations/mongoProductRepository.js";

class ProductService {
    async createProduct(data) {
        return productRepo.createProduct(data);
    }

    async getProductById(id) {
        return productRepo.getProductById(id);
    }

    async getAllProducts() {
        return productRepo.getAllProducts();
    }

    async updateProduct(id, data) {
        return productRepo.updateProduct(id, data);
    }

    async deleteProduct(id) {
        return productRepo.deleteProduct(id);
    }
}

export default new ProductService