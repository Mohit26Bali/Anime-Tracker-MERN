import express from "express";
import * as progressController from "../controllers/progressController.js";
import {
  createProgressValidator,
  updateProgressValidator,
} from "../validators/progressValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createProgressValidator, handleValidationErrors, progressController.addEntry);
router.get("/", progressController.getEntries);
router.patch(
  "/:id",
  updateProgressValidator,
  handleValidationErrors,
  progressController.updateEntry
);

export default router;
