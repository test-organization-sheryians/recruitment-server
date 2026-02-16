import mongoose from "mongoose";

const { Schema } = mongoose;

const AReviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "reviews",
  }
);

// One user can review one product only

AReviewSchema.index(
  { productId: 1, userId: 1 },
  { unique: true }
);

export const AReview = mongoose.model("AReview", AReviewSchema);
