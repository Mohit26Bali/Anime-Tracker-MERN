import Comment from "../models/Comment.js";
import Review from "../models/Review.js";
import buildCommentTree from "../utils/buildCommentTree.js";

const notFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

export const createComment = async (userId, { review, parentComment, text }) => {
  const reviewExists = await Review.exists({ _id: review });
  if (!reviewExists) throw notFoundError("Review not found");

  if (parentComment) {
    const parent = await Comment.findOne({ _id: parentComment, review });
    if (!parent) throw notFoundError("Parent comment not found on this review");
  }

  return Comment.create({ user: userId, review, parentComment: parentComment || null, text });
};

export const getCommentsForReview = async (reviewId) => {
  const comments = await Comment.find({ review: reviewId })
    .populate("user", "username avatar")
    .sort({ createdAt: 1 });

  return buildCommentTree(comments);
};

export const updateComment = async (userId, id, text) => {
  const comment = await Comment.findOne({ _id: id, user: userId });
  if (!comment) throw notFoundError("Comment not found");

  comment.text = text;
  await comment.save();
  return comment;
};

const collectDescendantIds = async (rootId) => {
  const ids = [rootId];
  let frontier = [rootId];

  while (frontier.length > 0) {
    const children = await Comment.find({ parentComment: { $in: frontier } }).select("_id");
    const childIds = children.map((c) => c._id.toString());
    if (childIds.length === 0) break;
    ids.push(...childIds);
    frontier = childIds;
  }

  return ids;
};

export const deleteComment = async (userId, id) => {
  const comment = await Comment.findOne({ _id: id, user: userId });
  if (!comment) throw notFoundError("Comment not found");

  const idsToDelete = await collectDescendantIds(comment._id.toString());
  await Comment.deleteMany({ _id: { $in: idsToDelete } });
  return comment;
};
