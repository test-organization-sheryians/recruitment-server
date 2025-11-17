import mongoose from "mongoose";

const { Schema } = mongoose;

const CandidateProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      unique: true,
      sparse: true,
    },

    availability: {
      type: String,
      enum: ["immediate", "1_week", "2_weeks", "1_month", "not_looking"],
      default: "not_looking",
    },
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,

    highestEducation: { type: String },
    resumeFile: { type: String },
    resumeScore: { type: Number },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
  },
  {
    timestamps: true,
    collection: "candidate_profiles",
  }
);

CandidateProfileSchema.index({ userId: 1 }, { unique: true });
CandidateProfileSchema.index({ resumeScore: -1 });
CandidateProfileSchema.index({ skills: 1 });
CandidateProfileSchema.index(
  { experienceId: 1 },
  {
    unique: true,
    partialFilterExpression: { experienceId: { $exists: true } },
  }
);

export const CandidateProfile = mongoose.model(
  "CandidateProfile",
  CandidateProfileSchema
);
