class IMessageRepository {
    async createMessage(messageData) {
      throw new Error("Method not implemented");
    }
  
    async findMessageById(id) {
      throw new Error("Method not implemented");
    }

    async updateMessage(id, messageData){
      throw new Error("Method not implemented");
    }

    async deleteMessage(id){
      throw new Error("Method not implemented");
    }

    async getAllMessages(){
      throw new Error("Method not implemented");
    }
  }
  
  export default IMessageRepository;