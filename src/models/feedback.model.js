import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // not using this interviewId
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

feedbackSchema.index({
  candidateId: 1,
  interviewerId: 1,
});

export default mongoose.model("Feedback", feedbackSchema);
