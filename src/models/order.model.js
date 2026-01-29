import mongoose from "mongoose";

const {Schema} = mongoose;

const orderSchema = new Schema({

    userId:{
        type:String,
        required:true
    },
    items:[
        {
       productId:{
        type:String,
        required:true
       },
       quantity:{
        type:Number,
        default:1
       },
       price:{
        type:Number,
        required:true
       }

        }
    ],
  
    status:{
        type:String,
        enum:["pendig","failed","success"],
        default:"pending"
    },
    PaymentStatus:{
        type:String,
           enum: ["pending", "failed", "success"],
      default: "pending",
    }

},{
    timestamps:true
})

const orderModel = mongoose.model("Orders",orderSchema)

export default orderModel;