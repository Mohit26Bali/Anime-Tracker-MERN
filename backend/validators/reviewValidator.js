import { body, param } from "express-validator";
import { idParamValidator } from "./validationHandler.js";

export const getReviewsValidator = [
  param("animeId").isInt().withMessage("animeId must be an integer"),
];

export const createReviewValidator = [
  body("animeId").isInt().withMessage("animeId must be an integer"),
  body("rating").isInt({ min: 1, max: 10 }).withMessage("rating must be between 1 and 10"),
  body("review").trim().notEmpty().withMessage("review text is required"),
];

export const updateReviewValidator = [
  idParamValidator,
  body("rating")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("rating must be between 1 and 10"),
  body("review").optional().trim().notEmpty().withMessage("review text cannot be empty"),
];

export const deleteReviewValidator = [idParamValidator];
