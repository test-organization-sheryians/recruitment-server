import mongoose from "mongoose";
import { AppError } from "../../utils/errors.js";
import Product from "../../models/product.model.js";
import IProductRepository from "../contracts/IProductRepository.js";

class MongoProductRepository extends IProductRepository {
    async createProduct(productData) {
        try {
            const product = new Product(productData);
            const savedProduct = await product.save();
            return savedProduct;
        } catch (error) {
            console.error("Error creating product:", error);
            throw new AppError(`Failed to create product: ${error.message}`, 500, error);
        }}

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new AppError("Product not found", 404);
            }
            return product;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw new AppError(`Failed to fetch product: ${error.message}`, 500, error);
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
            if (!updatedProduct) {
                throw new AppError("Product not found", 404);
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product:", error);
            throw new AppError(`Failed to update product: ${error.message}`, 500, error);
        }
    }   

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new AppError("Product not found", 404);
            }
            return deletedProduct;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw new AppError(`Failed to delete product: ${error.message}`, 500, error);
        }}
}
export default MongoProductRepository;
