import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobRole",
    required: true,
    index: true
  }
}, {
  timestamps: true
});


savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);
