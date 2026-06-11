import mongoose from "mongoose";

const { Schema } = mongoose;

const ProjectSchema = new Schema({
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'CandidateProfile',
        required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    technologies: [{ type: String, trim: true },],
},
    {
        timestamps: true,
        collection: 'projects'
    })

ProjectSchema.index({ candidateId: 1 });
ProjectSchema.index({ title: 1 });

export const Project = mongoose.model("Project", ProjectSchema);