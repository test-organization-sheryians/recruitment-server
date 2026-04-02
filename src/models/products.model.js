import Joi from "joi";
import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [5, "Price cannot exceed 5 figures"],
    default: 0.0
  },
  ratings: {
    type: Number,
    default: 0
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"]
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [5, "Stock cannot exceed 5 figures"],
    default: 0
  },
}, { timestamps: true }); // Automatically adds updatedAt and createdAt

const productModel= mongoose.model('Product', productSchema);
export default productModel