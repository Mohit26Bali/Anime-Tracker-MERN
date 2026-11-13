import Progress from "../models/Progress.js";

const notFoundError = () => {
  const error = new Error("Progress entry not found");
  error.statusCode = 404;
  return error;
};

export const createProgress = async (userId, { animeId, currentEpisode }) => {
  const existing = await Progress.findOne({ user: userId, animeId });
  if (existing) {
    const error = new Error("Progress for this anime already exists");
    error.statusCode = 409;
    throw error;
  }

  return Progress.create({ user: userId, animeId, currentEpisode });
};

export const getProgress = async (userId) => {
  return Progress.find({ user: userId }).sort({ updatedAt: -1 });
};

export const updateProgress = async (userId, id, currentEpisode) => {
  const entry = await Progress.findOne({ _id: id, user: userId });
  if (!entry) throw notFoundError();

  entry.currentEpisode = currentEpisode;
  await entry.save();
  return entry;
};
