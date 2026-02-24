import mongoose from "mongoose";

const questionSchema  = new mongoose.Schema(
  {
   
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      minlength: [5, "Question title must be at least 5 characters"],
      maxlength: [500, "Question title cannot exceed 500 characters"],
    },
    inputType: {
      type: String,
      required: [true, "Input type is required"],
      enum: {
        values: [
          "text",
          "textarea",
          "radio",
          "checkbox",
          "dropdown",
          "yes-no",
          "file",
          "date",
          "number",
          "rating",
        ],
        message: "Invalid input type: {VALUE}",
      },
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    options: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          const requiresOptions = ["radio", "checkbox", "dropdown"];
          if (requiresOptions.includes(this.inputType)) {
            return arr && arr.length > 0;
          }
          return true;
        },
        message: "Options are required for radio, checkbox, or dropdown questions",
      },
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isKnockout: {
      type: Boolean,
      default: false,
    },
    knockoutValue: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      trim: true,
    },
    maxLength: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: true, 
  }
);


 const JobApplicationQuestionsSchema = new mongoose.Schema(
  {
      jobId:{
          type:mongoose.Schema.Types.ObjectId,
          required:true , 
          ref:"JobRole"
           
      }, 
      questions:[questionSchema]
  }
 )

JobApplicationQuestionsSchema.index({ jobId: 1 });

const JobApplicationQuestions = mongoose.model(
  "JobApplicationQuestion", 
  JobApplicationQuestionsSchema
);

export default JobApplicationQuestions;