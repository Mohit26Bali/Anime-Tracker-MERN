import * as commentService from "../services/commentService.js";

export const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(req.user._id, {
      ...req.body,
      review: req.params.reviewId,
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const tree = await commentService.getCommentsForReview(req.params.reviewId);
    res.status(200).json(tree);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(req.user._id, req.params.id, req.body.text);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.user._id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
