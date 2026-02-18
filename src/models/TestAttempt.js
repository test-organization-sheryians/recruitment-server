import mongoose from "mongoose";

const TestAttemptSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },    
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Started", "Submitted", "Graded", "Failed", "Disqualified"],
      default: "Submitted",
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    durationTaken: {
      type: Number,
    },
    questions: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    answers: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    tabSwitches: {
    type: Number,
    default: 0
  },
  isDisqualified: {
    type: Boolean,
    default: false
  },
  },
  {
    timestamps: true,
  }
);

const TestAttempts = mongoose.model("TestAttempt", TestAttemptSchema);

export default TestAttempts;
