import mongoose from "mongoose"
import {Schema} from "mongoose"

const ProductSchema = new Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    price:{
        type:String,
        required:true,
    },
    
},
{
    timestamps:true,
}

)
export const Product = mongoose.model("Products",ProductSchema)