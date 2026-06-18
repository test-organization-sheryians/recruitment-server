import { redisClient } from "../config/redis.js";
import MongoProductRepository from "../repositories/implementations/mongoProductRepository.js";
import RedisCacheRepository from "../repositories/implementations/redisCacheRepository.js";
import { AppError } from "../utils/errors.js";

class ProductService {
  constructor() {
    this.productRepository = new MongoProductRepository();
    this.cacheRepository = new RedisCacheRepository();
  }

  async createProduct(data) {
    if (!data.title || !data.price?.amount) {
      throw new AppError("Title and price are required", 422);
    }

    if (data.price.amount < 0) {
      throw new AppError("Price cannot be negative", 400);
    }

    await this.clearProductCache();

    return await this.productRepository.createProduct(data);
  }

  async getAllProducts(page, limit) {
    const cacheKey = `products:${page}:${limit}`;

    const cached = await this.cacheRepository.get(cacheKey);

    if (cached) {
      return cached;
    }

    const products = await this.productRepository.getAllProducts(page, limit);

    await this.cacheRepository.set(cacheKey, products, 300);

    return products;
  }

  async getProductById(id) {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new AppError("Product now found", 404);
    }

    return product;
  }

  async updateProduct(id, data) {
    if (data.price?.amount && data.price.amount < 0) {
      throw new AppError("Price cannot be negative", 400);
    }

    const updated = await this.productRepository.updateProduct(id, data);

    if (!updated) throw new AppError("Product not found", 404);

    await this.clearProductCache();

    return updated;
  }

  async deleteProduct(id) {
    const deleted = await this.productRepository.deleteProduct(id);

    if (!deleted) throw new AppError("Product not found to be deleted", 404);

    await this.clearProductCache();

    return deleted;
  }

  async clearProductCache() {
    await this.delByPattern("products:*");
  }

  async delByPattern(pattern) {
    try {
      let keys = null;

      for await (const key of redisClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
      })) {
        keys = key;
      }
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      // return
    } catch (error) {
      console.log(error);
      throw new AppError("Failed to delete cache by pattern", 500);
    }
  }
}

export default ProductService;
