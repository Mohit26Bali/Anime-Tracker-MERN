import User from "../models/User.js";

export const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });
  return user;
};

export const updateProfile = async (userId, { username, avatar }) => {
  if (username) {
    const existing = await User.findOne({ username, _id: { $ne: userId } });
    if (existing) {
      const error = new Error("Username is already taken");
      error.statusCode = 409;
      throw error;
    }
  }

  const user = await User.findById(userId);
  if (username) user.username = username;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();

  return user;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User no longer exists");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword; // hashed by the pre-save hook
  user.tokenVersion = (user.tokenVersion ?? 0) + 1; // signs out every other session
  await user.save();

  return user;
};

export const loginUser =async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return user;
};
