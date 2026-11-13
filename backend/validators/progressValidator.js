import { body } from "express-validator";
import { idParamValidator } from "./validationHandler.js";

export const createProgressValidator = [
  body("animeId").isInt().withMessage("animeId must be an integer"),
  body("currentEpisode").isInt({ min: 0 }).withMessage("currentEpisode must be 0 or greater"),
];

export const updateProgressValidator = [
  idParamValidator,
  body("currentEpisode").isInt({ min: 0 }).withMessage("currentEpisode must be 0 or greater"),
];
