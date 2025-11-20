import mongoose from "mongoose";

const { Schema } = mongoose;

const ExperienceSchema = new Schema({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'CandidateProfile',
    required: true,
    index: true,
  },

  company: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },       
  location: { type: String, trim: true },                     
  description: { type: String, trim: true },

  startDate: { type: Date, required: true },                  
  endDate: { type: Date },                                   
  isCurrent: { type: Boolean, default: false },
},
{
  timestamps: true,
  collection: 'experiences'
});

ExperienceSchema.index({ candidateId: 1, startDate: -1 });  
ExperienceSchema.index({ company: 1 });
ExperienceSchema.index({ title: 1 });

export const Experience = mongoose.model("Experience" , ExperienceSchema) ; 