import mongoose from "mongoose";
import crypto from "crypto";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobRoles",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
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
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent same user from applying twice for same job
jobApplicationSchema.index({ jobId: 1, candidateId: 1 });

// jobApplicationSchema.pre("save", function (next) {
//   if (!this.duplicateHash) {
//     const hash = crypto.createHash("sha256");
//     hash.update(`${this.candidateId}_${this.jobId}`).digest("hex");

//     this.duplicateHash = hash;
//   }
//   next();
// });
export default mongoose.model("JobApplication", jobApplicationSchema, "jobapplications");
// export default mongoose.model("JobApplication", jobApplicationSchema);
