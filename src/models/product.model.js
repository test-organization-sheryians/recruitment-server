import mongoose from "mongoose"

const {Schema} = mongoose

const prodSchema = new Schema({
   

    prodName:{
        type: String,
        required: true
    },
    prodDesc:{
        type: String,
        required: true
    },
    prodPrice:{
        type: String,
        required: true
    }
},{
    timestamps: true
})


const prodModel = mongoose.model("product", prodSchema)

export default prodModel;