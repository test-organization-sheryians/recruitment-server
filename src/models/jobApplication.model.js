import mongoose from "mongoose";
import crypto from "crypto";

const jobApplicationSchema = new mongoose.Schema(
<<<<<<< HEAD
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
                                    default: "applied",
                        },
                        appliedAt: {
                                    type: Date,
                                    default: Date.now,
                        },
            },
            { timestamps: true }
=======
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
>>>>>>> b2141d8 (feat:implement the all routes and controller)
);

// Prevent same user from applying twice for same job
jobApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// jobApplicationSchema.pre("save", function (next) {
//   if (!this.duplicateHash) {
//     const hash = crypto.createHash("sha256");
//     hash.update(`${this.candidateId}_${this.jobId}`).digest("hex");

//     this.duplicateHash = hash;
//   }
//   next();
// });

export default mongoose.model("JobApplication", jobApplicationSchema);
