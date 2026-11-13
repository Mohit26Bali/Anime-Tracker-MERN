import express from "express";
import * as animeController from "../controllers/animeController.js";
import {
  searchAnimeValidator,
  trendingAnimeValidator,
  getAnimeByIdValidator,
  recommendationsValidator,
} from "../validators/animeValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";

const router = express.Router();

router.get("/search", searchAnimeValidator, handleValidationErrors, animeController.search);
router.get(
  "/trending",
  trendingAnimeValidator,
  handleValidationErrors,
  animeController.getTrending
);
router.get(
  "/:id/recommendations",
  recommendationsValidator,
  handleValidationErrors,
  animeController.getRecommendations
);
router.get("/:id", getAnimeByIdValidator, handleValidationErrors, animeController.getById);

export default router;
