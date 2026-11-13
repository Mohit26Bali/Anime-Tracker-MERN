import Favorite from "../models/Favorite.js";

export const addFavorite = async (userId, { animeId }) => {
  const existing = await Favorite.findOne({ user: userId, animeId });
  if (existing) {
    const error = new Error("This anime is already in your favorites");
    error.statusCode = 409;
    throw error;
  }

  return Favorite.create({ user: userId, animeId });
};

export const getFavorites = async (userId) => {
  return Favorite.find({ user: userId }).sort({ createdAt: -1 });
};

export const removeFavorite = async (userId, id) => {
  const entry = await Favorite.findOneAndDelete({ _id: id, user: userId });
  if (!entry) {
    const error = new Error("Favorite not found");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};
