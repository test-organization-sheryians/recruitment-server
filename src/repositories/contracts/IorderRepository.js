
//  write All method

class ICartRepository{
    
    async createdOrder(Data){
        throw new Error("Create methos not implement")
    }

    async getOrder(id){
         throw new Error("getOrder methos not implement")
    }

    async getOrderByuser(id){
     throw new Error("Error in the getOrder")
    }

    async removeOrder(id,Data){
        throw new Error("Error in the remove Order")
    }

}

export default ICartRepository;