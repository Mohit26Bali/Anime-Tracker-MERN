import Watchlist from "../models/Watchlist.js";

const notFoundError = () => {
  const error = new Error("Watchlist entry not found");
  error.statusCode = 404;
  return error;
};

export const addToWatchlist = async (userId, { animeId, status }) => {
  const existing = await Watchlist.findOne({ user: userId, animeId });
  if (existing) {
    const error = new Error("This anime is already on your watchlist");
    error.statusCode = 409;
    throw error;
  }

  return Watchlist.create({ user: userId, animeId, status });
};

export const getWatchlist = async (userId) => {
  return Watchlist.find({ user: userId }).sort({ createdAt: -1 });
};

export const updateWatchlistStatus = async (userId, id, status) => {
  const entry = await Watchlist.findOne({ _id: id, user: userId });
  if (!entry) throw notFoundError();

  entry.status = status;
  await entry.save();
  return entry;
};

export const removeFromWatchlist = async (userId, id) => {
  const entry = await Watchlist.findOneAndDelete({ _id: id, user: userId });
  if (!entry) throw notFoundError();
  return entry;
};
