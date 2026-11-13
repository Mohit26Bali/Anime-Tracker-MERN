import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewsValidator,
} from "../validators/reviewValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";
import commentRoutes from "./commentRoutes.js";

const router = express.Router();

router.post("/", protect, createReviewValidator, handleValidationErrors, reviewController.addReview);
router.get(
  "/anime/:animeId",
  getReviewsValidator,
  handleValidationErrors,
  reviewController.getReviews
);
router.patch(
  "/:id",
  protect,
  updateReviewValidator,
  handleValidationErrors,
  reviewController.updateReview
);
router.delete(
  "/:id",
  protect,
  deleteReviewValidator,
  handleValidationErrors,
  reviewController.deleteReview
);

router.use("/:reviewId/comments", commentRoutes);

export default router;
