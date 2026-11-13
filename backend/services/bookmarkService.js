import Bookmark from "../models/Bookmark.js";

export const addBookmark = async (userId, { characterId }) => {
  const existing = await Bookmark.findOne({ user: userId, characterId });
  if (existing) {
    const error = new Error("This character is already bookmarked");
    error.statusCode = 409;
    throw error;
  }

  return Bookmark.create({ user: userId, characterId });
};

export const getBookmarks = async (userId) => {
  return Bookmark.find({ user: userId }).sort({ createdAt: -1 });
};

export const removeBookmark = async (userId, id) => {
  const entry = await Bookmark.findOneAndDelete({ _id: id, user: userId });
  if (!entry) {
    const error = new Error("Bookmark not found");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};
