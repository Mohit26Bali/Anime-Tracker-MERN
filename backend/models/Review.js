import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    animeId: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, animeId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
