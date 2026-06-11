import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter company name"],
      trim: true,
      maxLength: [100, "Company name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Please enter company description"],
      minlength: [10, "Description must be at least 10 characters long"],
    },

    website: {
      type: String,
      required: [true, "Please enter company website"],
      trim: true,
    },

    industry: {
      type: String,
      required: [true, "Please enter company industry"],
      trim: true,
    },

    companySize: {
      type: String,
      required: [true, "Please enter company size"],
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },

    location: {
      type: String,
      required: [true, "Please enter company location"],
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const companyModel = mongoose.model("Company", companySchema);

export default companyModel;