import productModel from '../../models/product.model.js';
import { AppError } from '../../utils/errors.js';
import IProductRepository from '../contracts/IProductRepository.js';

class MongoProductRepository extends IProductRepository {
    async create(productData) {
        try {
            const product = new productModel(productData);
            return await product.save();
        } catch (err) {
            if (err.code === 11000) {
                const duplicateField = Object.keys(err.keyValue || {})[0];
                throw new AppError(
                    `Product ${duplicateField} '${err.keyValue[duplicateField]}' already exists`,
                    409
                );
            }
            throw new AppError('Failed to create product', 500);
        }
    }

    async findAll(filter = {}) {
        try {
            const products = await productModel
                .find(filter)
                .sort({ createdAt: -1 });
            return products;
        } catch (err) {
            throw new AppError('Failed to fetch products', 500);
        }
    }

    async findById(productId) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new AppError('Product not found', 404);
            }
            return product;
        } catch (err) {
            if (err.message === 'Product not found') throw err;
            throw new AppError('Failed to fetch product', 500);
        }
    }

    async findByCategory(categoryId) {
        try {
            const products = await productModel
                .find({ category: categoryId })
                .sort({ createdAt: -1 });
            return products;
        } catch (err) {
            throw new AppError('Failed to fetch products by category', 500);
        }
    }

    async updateById(productId, updateData) {
        try {
            const updated = await productModel.findByIdAndUpdate(
                productId,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );
            if (!updated) {
                throw new AppError('Product not found', 404);
            }
            return updated;
        } catch (err) {
            if (err.code === 11000) {
                const duplicateField = Object.keys(err.keyValue || {})[0];
                throw new AppError(
                    `Product ${duplicateField} already exists`,
                    409
                );
            }
            if (err.message === 'Product not found') throw err;
            throw new AppError('Failed to update product', 500);
        }
    }

    async deleteById(productId) {
        try {
            const deleted = await productModel.findByIdAndDelete(productId);
            if (!deleted) {
                throw new AppError('Product not found', 404);
            }
            return deleted;
        } catch (err) {
            if (err.message === 'Product not found') throw err;
            throw new AppError('Failed to delete product', 500);
        }
    }
}

export default MongoProductRepository;