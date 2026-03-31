import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
    constructor() {
        this.productRepository = new MongoProductRepository();
    }

    async createProduct(productData) {
        const { title } = productData;
        console.log(title, "This is product title");

        const existingProduct = await this.productRepository.findProductByTitle(title);
        if (existingProduct) {
            throw new AppError(`Product already existed`, 400)
        };

        const newProduct = await this.productRepository.createProduct(productData);
        return newProduct
    };

    async getAllProducts() {
        const allProducts = await this.productRepository.getAllProducts();
        return allProducts
    };

    async getProductById(productId) {
        const product = await this.productRepository.getProductById(productId)
        if (!product) {
            throw new AppError(`product not found`, 404)
        }
        return product
    };

    async updateProduct(productId, productData) {
        const updateBody = {};

        if (productData.title) updateBody.title = productData.title;
        if (productData.description) updateBody.description = productData.description;
        if (productData.price) updateBody.price = productData.price;
        if (productData.category) updateBody.category = productData.category;


        const product = await this.productRepository.updateProduct(productId, updateBody);
        if (!product) {
            throw new AppError(`product not found`, 404)
        };

        return product
    };

    async deleteProduct(productId) {
        const product = await this.productRepository.deleteProduct(productId);
        if (!product) {
            throw new AppError(`product not found`, 404)
        };
        return product
    };
}

export default ProductService