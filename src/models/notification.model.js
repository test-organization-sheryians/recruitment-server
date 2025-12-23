import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  userId: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["JOB_ALERT", "APPLICATION", "INTERVIEW", "SYSTEM"],
    default: "SYSTEM",
  },

  isRead: {
    type: Boolean,
    default: false,
  },
},
{
    timestamps: true
})

const Notification = mongoose.model("Notification",notificationSchema)
export default Notification;
