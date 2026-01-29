import ICartRepository from "../contracts/ICartRepository.js";
import Product from "../../models/cart.model.js";
import { tryCatch } from "bullmq";
import { RestoreRequestType } from "@aws-sdk/client-s3";


class mongoCartDataRepository extends ICartRepository{

   async createdProduct(CartData){
    try {
        return await Product.create(CartData)
    } catch (error) {
        throw new Error(error.message, 500);
    }
   }

   async getProductById(id){ 
        return await Product.findById(id)
   }

   async getAllProduct(){
    return await Product.find().sort({ createAt: -1})
   }

   async updateProduct(id , CartData){
   return await Product.findByIdAndUpdate(id, CartData, { new: true });
   }

   async deletProduct(id){
    return await Product.findByIdAndDelete(id);
   }

}

export default mongoCartDataRepository;