import productModel from "../models/products.model.js";
import mongoProductRepository from "../repositories/implementations/mongoProductsRepository.js"
import { AppError } from "../utils/errors.js";


class productService {
    constructor() {
        this.productrepository = new mongoProductRepository()
    }

    async createProduct(productData) {
        let existingProduct = await productModel.findOne({ name: productData.name })
        if (existingProduct) {
            throw new AppError("Product with this name already exists", 400);
        }
        console.log("your product data in services is", productData)
        return await this.productrepository.createProduct(productData)
    }

    async getAllProducts() {
        return await this.productrepository.getAllProducts()
        // Toh aap Service se keh rahe ho: "Bhai, ab tumhara kaam shuru hota hai. Repository ke paas jao, aur uske andar jo 
        // getAllProducts wala function (Database query) likha hai, usey execute karwao aur data lekar aao."
    }

    async getSingleProduct(id) {
        let product = await this.productrepository.getSingleProduct(id)
        if (!product) {
            throw new AppError("product not found", 404)
        }
        return product
    }

    async updateProduct(id, newData) {
        let product = await this.productrepository.getSingleProduct(id)
        if (!product) {
            throw new AppError('product not found', 404)
        }
        ///yaha par agar wo product exist karta hai to usko update karne ke liye bhej dege
        return await this.productrepository.updateProduct(id, newData)
    }
    async deleteProduct(id) {
        return await this.productrepository.deleteProducts(id)
    }
}

export default productService