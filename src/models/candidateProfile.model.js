import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const isValidSocialUrl = (value) => {
  if (!value || value.trim() === "") return true;
  return validator.isURL(value.trim(), {
    protocols: ["http", "https"],
    require_protocol: true,
  });
};

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
    linkedinUrl: {
      type: String,
      trim: true,
      validate: {
        validator: isValidSocialUrl,
        message: "LinkedIn URL must be a valid URL",
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: isValidSocialUrl,
        message: "GitHub URL must be a valid URL",
      },
    },
    portfolioUrl: {
      type: String,
      trim: true,
      validate: {
        validator: isValidSocialUrl,
        message: "Portfolio URL must be a valid URL",
      },
    },
    leetcodeUrl: {
      type: String,
      trim: true,
      validate: {
        validator: isValidSocialUrl,
        message: "LeetCode URL must be a valid URL",
      },
    },
    
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

export const CandidateProfile = mongoose.model(
  "CandidateProfile",
  CandidateProfileSchema
);
