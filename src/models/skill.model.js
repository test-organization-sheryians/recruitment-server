import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ name: "text" });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
