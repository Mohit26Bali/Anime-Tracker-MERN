import { body } from "express-validator";
import { idParamValidator } from "./validationHandler.js";

export const createFavoriteValidator = [
  body("animeId").isInt().withMessage("animeId must be an integer"),
];

export const deleteFavoriteValidator = [idParamValidator];
