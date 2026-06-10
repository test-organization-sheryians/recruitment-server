import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, "Product name cannot execute 100 chracter "],
    },

    description: {
      type: String,
      required: [true, "Fill description of product"],
    },
    price: {
      type: Number,
      required: [true, "Fiil product price"],
      maxLength: [5, "price cannout exceed 5 figures"],
      default: 0.0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Fill product stock"],
      default: 0,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product" , productSchema)
export default productModel