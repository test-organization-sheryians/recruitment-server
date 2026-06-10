import mongoose from 'mongoose';

const shareCandidateSchema = new mongoose.Schema({
  groupName:{
     type: String,
     required: [true, "Group name is required"],
     trim: true,
  }, 
  selectedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
},   {timestamps:true} // Add timestamps to automatically manage createdAt and updatedAt fields
);

export default mongoose.model('ShareCandidate', shareCandidateSchema);


// get  ,  delete  , update 