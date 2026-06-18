import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    description: {
        type:String
    },
    price: {
        type: Number,
        required:true
    }
}, {
    timestamps:true
})

export const Product = mongoose.model("Product", productSchema);