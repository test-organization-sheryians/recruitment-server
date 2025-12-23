import mongoose from "mongoose"
import Notification from "../../models/notification.model.js"
import INotificationRepository from "../contracts/INotificationRepository.js"
import { AppError } from "../../utils/errors.js"

class MongoNotificationRepository extends INotificationRepository {
  async createNotification(data) {
    try {
      const notification = new Notification(data)
      return await notification.save()
    } catch (error) {
      throw new AppError(`Failed to create notification:${error.message}`, 500, error)
    }
  }

  async findByUserId(userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid userId", 400)
      }
      
      const notification= await Notification.find({  userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
      return notification;
      
  }

  async findById(notificationId){
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new AppError("Invalid notificationId",400);
    }

    return Notification.findById(notificationId);
  }

  async markAsRead(notificationId){
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new AppError("Invalid notificationId",400);
    }

    return Notification.findByIdAndUpdate(
        notificationId,
        {isRead:true},
        {new:true}
    )
  }

  async deleteNotification(notificationId){
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new AppError("Invalid notificationId",400);
    }

    return Notification.findByIdAndDelete(notificationId);
  }
}

export default MongoNotificationRepository;