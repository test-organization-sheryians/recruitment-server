import MessageService from "../services/message.service.js";
import { AppError } from "../utils/errors.js";

class MessageController {
    constructor() {
        this.messageService = new MessageService();

        this.createMessage = this.createMessage.bind(this);
        this.findMessageById = this.findMessageById.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.getAllMessages = this.getAllMessages.bind(this);
    }

    createMessage = async (req, res, next) => {
        try{
            const response = await this.messageService.createMessage(req.body);
            if(!response){
                throw new AppError("Failed to create message", 400);
            }
            return res.status(201).json({
                success: true,
                message: "Message created successfully",
                data: response
            });
        }catch(err){
            next(err);
        }
    };

    findMessageById = async (req, res, next) => {
        try{
            const { id } = req.params;
            const response = await this.messageService.findMessageById(id);
            if(!response){
                throw new AppError("Failed to find message", 400);
            }
            return res.status(200).json({
                success: true,
                message: "Message found successfully",
                data: response
            });
        }catch(err){
            next(err);
        }
    };

    updateMessage = async (req, res, next) => {
        try{
            const { id } = req.params;
            const response = await this.messageService.updateMessage(id, req.body);
            if(!response){
                throw new AppError("Failed to update message", 400);
            }
            return res.status(200).json({
                success: true,
                message: "Message updated successfully",
                data: response
            });
        }catch(err){
            next(err);
        }
    };

    deleteMessage = async (req, res, next) => {
        try{
            const { id } = req.params;
            const response = await this.messageService.deleteMessage(id);
            if(!response){
                throw new AppError("Failed to delete message", 400);
            }
            return res.status(200).json({
                success: true,
                message: "Message deleted successfully",
                data: response
            });
        }catch(err){
            next(err);
        }
    };

    getAllMessages = async (req, res, next) => {
        try{
            const response = await this.messageService.getAllMessages();
            if(!response){
                throw new AppError("Failed to get messages", 400);
            }
            return res.status(200).json({
                success: true,
                message: "Messages retrieved successfully",
                data: response
            });
        }catch(err){
            next(err);
        }
    };
}

export default new MessageController();