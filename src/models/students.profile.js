import mongoose from "mongoose";

const StudentsProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNo: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfileModel = mongoose.model(
  "StudentsProfile",
  StudentsProfileSchema
);

export default StudentProfileModel;