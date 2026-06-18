import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    image: {
      type: String,
      default: "No image provided.",
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["INR", "$"],
        default: "INR",
      },
    },
  },
  { timestamps: true },
);

const ProductsModel = mongoose.model("products", productsSchema);

export default ProductsModel;
