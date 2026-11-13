import { body } from "express-validator";
import { idParamValidator } from "./validationHandler.js";

export const createBookmarkValidator = [
  body("characterId").isInt().withMessage("characterId must be an integer"),
];

export const deleteBookmarkValidator = [idParamValidator];
