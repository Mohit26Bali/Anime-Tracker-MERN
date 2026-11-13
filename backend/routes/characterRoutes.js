import express from "express";
import * as characterController from "../controllers/characterController.js";
import {
  getCharacterByIdValidator,
  searchCharacterValidator,
} from "../validators/characterValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";

const router = express.Router();

router.get(
  "/search",
  searchCharacterValidator,
  handleValidationErrors,
  characterController.search
);
router.get(
  "/:id",
  getCharacterByIdValidator,
  handleValidationErrors,
  characterController.getById
);

export default router;
