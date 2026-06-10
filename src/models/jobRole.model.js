import mongoose from "mongoose";


const locationSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
  pincode: String
})
const jobRoleSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    requiredExperience: {
  type: Number,
  
  required: true,
  index: true,
},

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
      index: true,
    },
    education: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        index: true,
      },
    ],
    expiry: {
      type: Date,
      required: true,
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    jobType: {
  type: String,
  enum: ["Remote", "Hybrid", "Full-Time", "Part-Time"],
  required: true,
  index: true,
},
salary: {
  min: {
    type: Number,
    required: true,
    index: true,
  },
  max: {
    type: Number,
    required: true,
    index: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
},


  },
  {
    timestamps: true,
  }
);

jobRoleSchema.index({ clientId: 1, title: 1 });
jobRoleSchema.index({ category: 1, expiry: 1 });
jobRoleSchema.index({ createdAt: -1 });

export default mongoose.model("JobRole", jobRoleSchema);