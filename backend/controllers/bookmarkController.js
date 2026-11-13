import * as bookmarkService from "../services/bookmarkService.js";

export const addEntry = async (req, res, next) => {
  try {
    const entry = await bookmarkService.addBookmark(req.user._id, req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const entries = await bookmarkService.getBookmarks(req.user._id);
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    await bookmarkService.removeBookmark(req.user._id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
