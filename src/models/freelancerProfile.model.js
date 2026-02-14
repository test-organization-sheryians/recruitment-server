import mongoose from "mongoose";
const { Schema } = mongoose;

const FreelancerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        githubUrl: String,
        demoUrl: String,
        imageUrl: String,
      },
    ],
    hourlyRate: {
      type: Number,
      min: 100,
      max: 5000,
    },
    availability: {
      type: String,
      enum: ["immediate", "1_week", "2_weeks", "busy"],
      default: "busy",
    },
    resumeFile: { type: String },
    portfolioScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "freelancer_profiles",
  },
);

FreelancerProfileSchema.index({ userId: 1 }, { unique: true });
FreelancerProfileSchema.index({ portfolioScore: -1 });
FreelancerProfileSchema.index({ skills: 1 });

export const FreelancerProfile = mongoose.model(
  "FreelancerProfile",
  FreelancerProfileSchema,
);
