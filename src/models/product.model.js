
import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
      },
  {
    timestamps: true,
    collection: "products",
  }
);

ProductSchema.index({ name: 1 });

export const Product = mongoose.model("Product", ProductSchema);