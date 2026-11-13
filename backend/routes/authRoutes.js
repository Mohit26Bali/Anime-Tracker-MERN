import express from "express";
import { register, login, logout, updateProfile, changePassword } from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/authValidator.js";
import { handleValidationErrors } from "../validators/validationHandler.js";
import protect from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidator, handleValidationErrors, register);
router.post("/login", authLimiter, loginValidator, handleValidationErrors, login);
router.get("/me", protect, (req, res) => {
  const { tokenVersion, ...user } = req.user.toObject(); // tokenVersion is internal
  res.json(user);
});
router.patch(
  "/password",
  protect,
  authLimiter,
  changePasswordValidator,
  handleValidationErrors,
  changePassword
);
router.patch("/me", protect, updateProfileValidator, handleValidationErrors, updateProfile);
router.post("/logout", protect, logout);

export default router;
