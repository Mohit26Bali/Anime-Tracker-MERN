import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Watching", "Completed", "Dropped", "On Hold", "Plan To Watch"],
      required: true,
    },
  },
  { timestamps: true }
);

watchlistSchema.index({ user: 1, animeId: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
