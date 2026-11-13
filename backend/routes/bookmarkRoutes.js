import express from "express";
import * as bookmarkController from "../controllers/bookmarkController.js";
import {
  createBookmarkValidator,
  deleteBookmarkValidator,
} from "../validators/bookmarkValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createBookmarkValidator, handleValidationErrors, bookmarkController.addEntry);
router.get("/", bookmarkController.getEntries);
router.delete(
  "/:id",
  deleteBookmarkValidator,
  handleValidationErrors,
  bookmarkController.deleteEntry
);

export default router;
