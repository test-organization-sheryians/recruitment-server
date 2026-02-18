import mongoose from "mongoose";

const jobReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    reason: {
      type: String,
      enum: ["spam", "fake", "wrong_info", "other"],
      default: "spam",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: function () {
        return this.reason === "other";
      },
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

jobReportSchema.index({ userId: 1, jobId: 1 }, { unique: true });
jobReportSchema.index({ status: 1, createdAt: -1 });
jobReportSchema.index({ jobId: 1 });
export const JobReport = mongoose.model("RaghavJobReport", jobReportSchema);
