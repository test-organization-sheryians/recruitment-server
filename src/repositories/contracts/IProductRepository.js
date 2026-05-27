class IProductRepository {
    async create(productData) {
        throw new Error('Method not implemented');
    }

    async findAll(filter = {}) {
        throw new Error('Method not implemented');
    }

    async findById(productId) {
        throw new Error('Method not implemented');
    }

    async findByCategory(categoryId) {
        throw new Error('Method not implemented');
    }

    async updateById(productId, updateData) {
        throw new Error('Method not implemented');
    }

    async deleteById(productId) {
        throw new Error('Method not implemented');
    }
}

export default IProductRepository;