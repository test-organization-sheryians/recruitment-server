import Product from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";
import IProductRepository from "../contracts/IProductRepository.js";

class MongoProductRepository extends IProductRepository {

    async createProduct(productData) {
        try {
            const product = new Product(productData);
            const savedProduct = await product.save();
            return savedProduct;
        } catch (error) {
            console.error("Error while creaing a product", error);
            throw new AppError(`Failed to create a product: ${error.message}`, 500, error);
        }
    }

    async findProductByTitle(title) {
        try {
            const product = await Product.findOne({ title });
            return product
        } catch (error) {
            throw new AppError(`Failed to find product`, 500, error)
        }
    }

    async getAllProducts() {
        try {
            const product = await Product.find();
            return product;
        } catch (error) {
            throw new AppError(`Failed to fetch products`, 500, error)
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            return product
        } catch (error) {
            throw new AppError(`Failed to fetch product`, 500, error)
        }
    };

    async updateProduct(productId, productData) {
        try {
            const product = await Product.findByIdAndUpdate(productId, {
                $set: productData
            }, { new: true, runValidators: true });

            return product;
        } catch (error) {
            throw new AppError(`Failed to update product`, 500, error)
        }
    };

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            return product
        } catch (error) {
            throw new AppError("Failed to delete product", 500);
        }
    }
};




export default MongoProductRepository