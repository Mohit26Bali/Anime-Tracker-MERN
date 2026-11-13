import { body, param } from "express-validator";
import { idParamValidator } from "./validationHandler.js";

export const reviewIdParamValidator = param("reviewId")
  .isMongoId()
  .withMessage("Invalid review id format");

export const createCommentValidator = [
  param("reviewId").isMongoId().withMessage("Invalid review id format"),
  body("parentComment")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("parentComment must be a valid id"),
  body("text").trim().notEmpty().withMessage("comment text is required"),
];

export const updateCommentValidator = [
  idParamValidator,
  body("text").trim().notEmpty().withMessage("comment text is required"),
];

export const deleteCommentValidator = [idParamValidator];
