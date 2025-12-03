import mongoose from "mongoose";

const TestsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summury: {
      type: String,
    },
    showResults: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    passingScore: {
      type: Number,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tests = mongoose.model("Test", TestsSchema);
export default Tests;
