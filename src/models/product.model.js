import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
  },
  {
    timestamps: true,
    collection: "shishir",  
  }
);

export const Product = mongoose.model("Products", ProductSchema);
