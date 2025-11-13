import mongoose from "mongoose";
import crypto from "crypto";

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
                        duplicateHash: { type: String, unique: true },
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
jobApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

jobApplicationSchema.pre("save", function (next) {
            if (!this.duplicateHash) {
                        const hash = crypto
                                    .createHash("sha256")
                                    .update(`${this.candidateId}_${this.jobId}`)
                                    .digest("hex");
                        this.duplicateHash = hash;
            }
            next();
});

export default mongoose.model("JobApplication", jobApplicationSchema);
