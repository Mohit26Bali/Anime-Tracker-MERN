import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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
    currentEpisode: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, animeId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
