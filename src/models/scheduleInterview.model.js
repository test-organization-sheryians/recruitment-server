import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobRole",
      required: true,
    },
   
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    meetingLink: {
        type: String,
        required: true
    },

    timing: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Scheduled", "Rescheduled", "Cancelled" ],
        default: "Scheduled"
    }
    ,
    isRescheduled: {
      type: Boolean,
      default: false,
    }
} , {
         timestamps: true
}
)

export default mongoose.model("Schedule", scheduleSchema);

