import IMessageRepository from "../contracts/IMessageRepository.js";
import Message from "../../models/message.model.js";
import { AppError } from "../../utils/errors.js";

class MongoMessageRepository extends IMessageRepository {
    async createMessage(userMessage) {
        try {
            const message = new Message(userMessage);
            return await message.save();
        } catch (error) {
            throw new AppError("Failed to create message", 500);
        }
    }

    async findMessageById(id) {
        try {
            return await Message.findById(id);
        } catch (error) {
            throw new AppError("Failed to find message", 500);
        }
    }

    async updateMessage(id, userMessage) {
        try {
            return await Message.findByIdAndUpdate(id, userMessage, { new: true });
        } catch (error) {
            throw new AppError("Failed to update message", 500);
        }
    }

    async deleteMessage(id) {
        try {
            return await Message.findByIdAndDelete(id);
        } catch (error) {
            throw new AppError("Failed to delete message", 500);
        }
    }

    async getAllMessages() {
        try {
            return await Message.find();
        } catch (error) {
            throw new AppError("Failed to get messages", 500);
        }
    }
}

export default MongoMessageRepository;