import express from "express";
import * as commentController from "../controllers/commentController.js";
import {
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
  reviewIdParamValidator,
} from "../validators/commentValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createCommentValidator, handleValidationErrors, commentController.addComment);
router.get(
  "/",
  reviewIdParamValidator,
  handleValidationErrors,
  commentController.getComments
);
router.patch(
  "/:id",
  protect,
  updateCommentValidator,
  handleValidationErrors,
  commentController.updateComment
);
router.delete(
  "/:id",
  protect,
  deleteCommentValidator,
  handleValidationErrors,
  commentController.deleteComment
);

export default router;
