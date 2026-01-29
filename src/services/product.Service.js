import MongoProductRepository from '../repositories/implementations/mongoCartDataRepository.js'


class productService{

    constructor(){
        this.productRepository = new MongoProductRepository();
    }
// || !CartData.prices
    async createdProduct(CartData){
        if(!CartData.name ){
            throw new Error("Error in the product service in createdProduct")
        }
         return await this.productRepository.createdProduct(CartData)
    }

   async getProductById(id){
     const product = await this.productRepository.getProductById(id)
     if(!product) throw new Error("erro in the service getproduct")
       return product
    }

    async getAllProduct(){
        await this.productRepository.getAllProduct();
    }

    async updateProduct(id , CartData){
        const product = this.productRepository.updateProduct(id, CartData)
          if(!product) throw new Error("error in the service in updateCart ")
        return product
        }

    async deletProduct(id){
        const product = await this.productRepository.deletProduct(id)
          if(!product) throw new Error("error in the service in deletProduct ")
           return product
        }

}

export default productService;