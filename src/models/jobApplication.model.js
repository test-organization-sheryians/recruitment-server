import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
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
    resumeUrl: String,
    message: String,
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "rejected",
        "forwareded",
        "interview",
        "hired",
      ],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent same user from applying twice for same job
jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export default mongoose.model("JobApplication", jobApplicationSchema);
