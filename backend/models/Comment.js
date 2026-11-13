import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

commentSchema.index({ review: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
