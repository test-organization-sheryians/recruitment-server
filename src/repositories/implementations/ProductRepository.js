import Product from "../../models/Product.js";

class ProductRepository {
  async create(productData) {
    return await Product.create(productData);
  }

  async findAll() {
    return await Product.find();
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();
