class INotificationRepositoty{
    async createNotification(data){
        throw new Error("Method not implemented");
    }

    async findByUserId(userId){
        throw new Error("method not implemented");
    }

    async findById(notificationId){
        throw new Error("method not implemented")
    }

    async maskAsRead(notificationId){
        throw new Error("method not implemented")
    }

    async deleteNotification(notificationId){
        throw new Error("method not implemented")
    }
}

export default INotificationRepositoty;