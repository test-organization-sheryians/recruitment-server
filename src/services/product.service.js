export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(productData) {
    return await this.productRepository.createProduct(productData);
  }

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id) {
    return await this.productRepository.findById(id);
  }

  async updateProduct(id, productData) {
    return await this.productRepository.updateProduct(id, productData);
  }

  async deleteProduct(id) {
    return await this.productRepository.deleteProduct(id);
  }
}
