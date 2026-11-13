import express from "express";
import * as watchlistController from "../controllers/watchlistController.js";
import {
  createWatchlistValidator,
  updateWatchlistValidator,
  deleteWatchlistValidator,
} from "../validators/watchlistValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createWatchlistValidator, handleValidationErrors, watchlistController.addEntry);
router.get("/", watchlistController.getEntries);
router.patch(
  "/:id",
  updateWatchlistValidator,
  handleValidationErrors,
  watchlistController.updateEntry
);
router.delete(
  "/:id",
  deleteWatchlistValidator,
  handleValidationErrors,
  watchlistController.deleteEntry
);

export default router;
