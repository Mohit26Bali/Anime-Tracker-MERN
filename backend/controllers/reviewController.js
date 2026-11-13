import * as reviewService from "../services/reviewService.js";

export const addReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user._id, req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsForAnime(req.params.animeId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.user._id, req.params.id, req.body);
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.user._id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
