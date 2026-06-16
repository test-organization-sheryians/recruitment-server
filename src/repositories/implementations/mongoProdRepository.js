import { IProductRepository } from "../contracts/IProductRepository.js";
import prodModel from "../../models/product.model.js"

class MongoProdRepository extends IProductRepository{

    async createProd(productData){
        return await prodModel.create(productData)
    }

    async getAllProd(){
        return await prodModel.find()
    }

    async getProdById(productId){
        return await prodModel.findById(productId)
    }

    async updateProd(productId, updateData){
        return await prodModel.findByIdAndUpdate(
            productId,
            updateData,
            {new: true}
        )
    }
    async deleteProd(productId){
        return await prodModel.findByIdAndDelete(productId)
    }
}

export default MongoProdRepository;