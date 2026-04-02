import { Product } from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";
import IProductRepositry from "../contracts/IProductRepository.js";

class mongoProductRepository extends IProductRepositry {
  async create(productData) {
    try {
      const newProduct = new Product(productData);
    return await newProduct.save();
    } catch (error) {
     throw new AppError(`Failed to create product: ${error.message}`, 500);
    }
  }

 async existedProduct(title) {
  try {
    return await Product.findOne({ title });
  } catch (error) {
    throw new AppError("Database error while checking product", 500);
  }
}

  async getProduct(id) {
  try {
  return await Product.findById(id);
  } catch (error) {
    throw new AppError(`Failed to fetch product: ${error.message}`, 500);
  }
}
  async getAllProducts() {
    try {
      return await Product.find();
      
    } catch (error) {
     throw new AppError(`Failed to fetch product: ${error.message}`, 500);
    }
  }

  
  async updateProduct(id, data) {
    try {
      
      return await Product.findByIdAndUpdate(id,data,
        {
          new: true,
         runValidators:true
       }
      )
    } catch (error) {
      throw new AppError(`Failed to update product: ${error.message}`, 500);
    }
  }

  async deleteProduct(id) {
    try {
     return await Product.findByIdAndDelete(id)
     
    
    } catch (error) {
     throw new AppError(`Failed to delete product: ${error.message}`, 500);
    }
  }
}
export default mongoProductRepository;
