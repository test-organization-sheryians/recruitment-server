import mongoose from "mongoose";

const savedCandidateSchema = new mongoose.Schema(
  {
    savedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ye compound index hai
// Combination of 2 fields  (savedBy + candidateId)
// Same recruiter ek hi candidate ko sirf ek baar save kar sakta hai
savedCandidateSchema.index({ savedBy: 1, candidateId: 1 }, { unique: true });

export default mongoose.model("SavedCandidate", savedCandidateSchema);
