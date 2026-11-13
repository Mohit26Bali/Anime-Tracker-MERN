import { param, query } from "express-validator";

export const getCharacterByIdValidator = [
  param("id").isInt().withMessage("id must be an integer"),
];

export const searchCharacterValidator = [
  query("q").trim().notEmpty().withMessage("Search query 'q' is required"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("perPage")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("perPage must be between 1 and 50"),
];
