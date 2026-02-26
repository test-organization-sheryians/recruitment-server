import mongoose from "mongoose";

const htmlUrlRegex = /^https:\/\/[a-z0-9.-]+\.s3\.[a-z0-9-]+\.amazonaws\.com\/.+\.html\d*$/i;

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Completion", "Internship", "Offer", "Other"],
      default: "Other",
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return htmlUrlRegex.test(v);
        },
        message: "File URL must be a valid .html link",
      },
    },
  },
  { timestamps: true },
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;