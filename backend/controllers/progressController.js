import * as progressService from "../services/progressService.js";

export const addEntry = async (req, res, next) => {
  try {
    const entry = await progressService.createProgress(req.user._id, req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const entries = await progressService.getProgress(req.user._id);
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const entry = await progressService.updateProgress(
      req.user._id,
      req.params.id,
      req.body.currentEpisode
    );
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};
