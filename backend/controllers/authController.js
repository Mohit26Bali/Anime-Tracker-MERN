import * as authService from "../services/authService.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    generateToken(res, user._id, user.tokenVersion);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    generateToken(res, user._id, user.tokenVersion);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await authService.changePassword(req.user._id, req.body);
    // Re-issue this browser's cookie with the new version so it stays signed in.
    generateToken(res, user._id, user.tokenVersion);
    res.status(200).json({ message: "Password updated. Other devices have been signed out." });
  } catch (error) {
    next(error);
  }
};

export const logout =(req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out" });
};
