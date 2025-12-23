import MongoNotificationRepository from "../repositories/implementations/mongoNotificationRepository.js"

import { AppError } from "../utils/errors.js"

class NotificationService {
  constructor() {
    this.notificationRepository = new MongoNotificationRepository()
  }

  async createNotification(data) {
    return await this.notificationRepository.createNotification(data)
  }

  async getUserNotifications(userId) {
    const notifications = await this.notificationRepository.findByUserId(userId);
    // console.log(notifications);
    
    return notifications;
  }

  async getNotificationById(notificationId) {
    const notification = await this.notificationRepository.findById(notificationId)

    if (!notification) {
      throw new AppError("Notification not found", 404)
    }

    return notification
  }

  async markNotificationAsRead(notificationId) {
    const notification = await this.notificationRepository.markAsRead(notificationId)

    if (!notification) {
      throw new AppError("Notification not found", 400)
    }

    return notification
  }

  async deleteNotification(notificationId) {
    const deleted = await this.notificationRepository.deleteNotification(notificationId)

    if (!deleted) {
      throw new AppError("Notification not found", 404)
    }

    return true
  }
}

export default NotificationService
