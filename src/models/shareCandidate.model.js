import mongoose from 'mongoose';

const shareCandidateSchema = new mongoose.Schema({
  selectedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model('ShareCandidate', shareCandidateSchema);
