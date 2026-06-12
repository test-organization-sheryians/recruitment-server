import mongoose from "mongoose";

const ReadersSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Reader", ReadersSchema);