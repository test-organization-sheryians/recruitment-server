import mongoose from "mongoose"

const StudentSchema = new mongoose.Schema({
   name:{
     type: String,
      require: true,
      trim:true
   },
   rollNo:{
    type: Number,
    required: true,
    unique:true
   },
   email:{
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true,
   },

    course: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

},
{
    timestamps: true
}
)

const studentModel = mongoose.model("studentProfile", StudentSchema)

export default studentModel