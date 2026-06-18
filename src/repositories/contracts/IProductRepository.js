class IProductRepositry{
    async getProduct(productData) {
        throw new Error("Method not implimented")
    }
    async create(productData) {
         throw new Error("Method not implimented")
    }
    async existedProduct(title) { 
         throw new Error("Method not implimented")
    }
    async getAllProducts() {
         throw new Error("Method not implimented")
    }
    async deleteProduct(id) {
         throw new Error("Method not implimented")
    }

    async updateProduct(id, data) { 
         throw new Error("Method not implimented")
    }
}
export default IProductRepositry;