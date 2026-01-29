
class ICartRepository{

    async createdProduct(CartData){
      throw new Error("Method Not Implemented")
    }

    async getProductById(id){
        throw new Error("Method Not Implemented")
    }

   async getAllProduct(){
      throw new Error("Method Not Implemented")
   }

   async updateProduct(id, data){
      throw new Error("Method Not Implemented")
   }

   async deletProduct(id){
      throw new Error("Method Not Implemented")
   }
   
}

export default ICartRepository;