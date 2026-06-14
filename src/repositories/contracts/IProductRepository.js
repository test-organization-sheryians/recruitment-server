
class IProductRepository {
  async createProduct(productData) {
    throw new Error("Method not implemented");
  }

  async findAllProducts() {
    throw new Error("Method not implemented");
  }

  async findProductById(productId) {
    throw new Error("Method not implemented");
  }

   async updateProduct(productId, productData) {
    throw new Error("Method not implemented");
  }

  async deleteProduct(productId) {
    throw new Error("Method not implemented");
  }
}

export default IProductRepository;