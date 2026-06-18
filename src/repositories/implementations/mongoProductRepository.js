import ProductModel from "../../models/product.model.js";
import IProductRepsitory from "../contracts/IProductRepository.js";

class MongoProductRepository extends IProductRepsitory {

  async createProduct(data) {
    return await ProductModel.create(data);
  }

  async getProduct(query) {
    let filter = {};

    // search
    if (query?.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
      ];
    }

    // category
    if (query?.category) {
      filter.category = query.category.toLowerCase();
    }

    return await ProductModel.find(filter);
  }

  async getProductById(id) {
    return await ProductModel.findById(id);
  }

  async updateProductById(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProductById(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default MongoProductRepository;