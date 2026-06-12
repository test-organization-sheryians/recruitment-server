class IProductRepository {
    async createProduct(productData){
        throw new Error("Method not implemented")
    }
    async findProductById(id) {
        throw new Error("Method not implemented");
    }
    async updateProduct(id,productData){
        throw new Error("Method not implemented")
    }
    async deleteProduct(id){
        throw new Error("Method not implemented")
    }
}

export default IProductRepository;