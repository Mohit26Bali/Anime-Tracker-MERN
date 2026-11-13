import Review from "../models/Review.js";
import Comment from "../models/Comment.js";

const notFoundError = () => {
  const error = new Error("Review not found");
  error.statusCode = 404;
  return error;
};

export const createReview = async (userId, { animeId, rating, review }) => {
  const existing = await Review.findOne({ user: userId, animeId });
  if (existing) {
    const error = new Error("You already reviewed this anime — edit your existing review instead");
    error.statusCode = 409;
    throw error;
  }

  return Review.create({ user: userId, animeId, rating, review });
};

export const getReviewsForAnime = async (animeId) => {
  return Review.find({ animeId })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });
};

export const updateReview = async (userId, id, { rating, review }) => {
  const entry = await Review.findOne({ _id: id, user: userId });
  if (!entry) throw notFoundError();

  if (rating !== undefined) entry.rating = rating;
  if (review !== undefined) entry.review = review;
  await entry.save();
  return entry;
};

export const deleteReview = async (userId, id) => {
  const entry = await Review.findOneAndDelete({ _id: id, user: userId });
  if (!entry) throw notFoundError();

  await Comment.deleteMany({ review: id });
  return entry;
};
