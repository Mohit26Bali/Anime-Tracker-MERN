import { body } from "express-validator";
import { idParamValidator } from "./validationHandler.js";

const STATUSES = ["Watching", "Completed", "Dropped", "On Hold", "Plan To Watch"];

export const createWatchlistValidator = [
  body("animeId").isInt().withMessage("animeId must be an integer"),
  body("status").isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

export const updateWatchlistValidator = [
  idParamValidator,
  body("status").isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

export const deleteWatchlistValidator = [idParamValidator];
