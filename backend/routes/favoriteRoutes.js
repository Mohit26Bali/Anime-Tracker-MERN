import express from "express";
import * as favoriteController from "../controllers/favoriteController.js";
import {
  createFavoriteValidator,
  deleteFavoriteValidator,
} from "../validators/favoriteValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createFavoriteValidator, handleValidationErrors, favoriteController.addEntry);
router.get("/", favoriteController.getEntries);
router.delete(
  "/:id",
  deleteFavoriteValidator,
  handleValidationErrors,
  favoriteController.deleteEntry
);

export default router;
