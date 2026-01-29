
import mongoose from "mongoose";

const {Schema} = mongoose;

const productSchema = new Schema({

    name:{
        type:String,
        required:true
    },
    prices:{
        type:String,
        required:true
    },
    description: {
      type: String,
    },
    subCategory:{
       type:String, 
    },
    stock: {
      type: Number,
      default: 0,
    }
},{
    timestamps:true
})

const Product = mongoose.model("Rajveer_",productSchema)

export default Product;