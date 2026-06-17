import MongoMessageRepository from "../repositories/implementations/mongoMessageRepository.js";
import { AppError } from "../utils/errors.js";

class MessageService {
    constructor() {
        this.messageRepository = new MongoMessageRepository();
    }

    async createMessage(messageData) {
        if(!messageData){
            throw new AppError("Message data is required", 400);
        }
        return await this.messageRepository.createMessage(messageData);
    }

    async findMessageById(id) {
        if(!id){
            throw new AppError("Message ID is required", 400);
        }
        return await this.messageRepository.findMessageById(id);
    }

    async updateMessage(id, messageData) {
        if(!id){
            throw new AppError("Message ID is required", 400);
        }
        if(!messageData){
            throw new AppError("Message data is required", 400);
        }
        return await this.messageRepository.updateMessage(id, messageData);
    }

    async deleteMessage(id) {
        if(!id){
            throw new AppError("Message ID is required", 400);
        }
        return await this.messageRepository.deleteMessage(id);
    }

    async getAllMessages() {
        return await this.messageRepository.getAllMessages();
    }
}

export default MessageService;