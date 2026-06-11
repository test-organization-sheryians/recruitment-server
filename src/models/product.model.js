import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required']
    },
    stock: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model('Product', productSchema);
