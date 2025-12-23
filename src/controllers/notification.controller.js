import NotificationService from "../services/notification.service.js"
import mongoose from "mongoose"
const notificationService = new NotificationService()

class NotificationController {
  constructor() {
    this.notificationService = new NotificationService()

    this.createNotification = this.createNotification.bind(this)
    this.findNotificationById = this.findNotificationById.bind(this)
    this.getMyNotifications = this.getMyNotifications.bind(this)
    this.markAsRead = this.markAsRead.bind(this)
    this.deleteNotification = this.deleteNotification.bind(this)
  }


  async createNotification(req, res, next) {
    try {
      const notification = await this.notificationService.createNotification({
        ...req.body,
        userId: new mongoose.Types.ObjectId(req.userId), 
      })

      return res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification,
      })
    } catch (error) {
      next(error)
    }
  }

  async getMyNotifications(req, res, next) {
    try {
      const userId = req.userId

      const notifications = await this.notificationService.getUserNotifications(userId)
      //   console.log(notifications);

      return res.status(200).json({
        success: true,
        data: notifications,
      })
    } catch (error) {
      next(error)
    }
  }

  async findNotificationById(req, res, next) {
    try {
      const { id } = req.params

      const notification = await this.notificationService.getNotificationById(id)

      return res.status(200).json({
        success: true,
        data: notification,
      })
    } catch (error) {
      next(error)
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params

      const notification = await this.notificationService.markNotificationAsRead(id)

      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params

      await this.notificationService.deleteNotification(id)

      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new NotificationController()
