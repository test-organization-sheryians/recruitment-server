import mongoose from "mongoose";

const TestEnrollmentsSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Assigned", "Started", "Completed"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

const TestEnrollments = mongoose.model("TestEnrollment", TestEnrollmentsSchema);

export default TestEnrollments;
