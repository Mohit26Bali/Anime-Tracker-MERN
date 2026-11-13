import * as watchlistService from "../services/watchlistService.js";

export const addEntry = async (req, res, next) => {
  try {
    const entry = await watchlistService.addToWatchlist(req.user._id, req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const entries = await watchlistService.getWatchlist(req.user._id);
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const entry = await watchlistService.updateWatchlistStatus(
      req.user._id,
      req.params.id,
      req.body.status
    );
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    await watchlistService.removeFromWatchlist(req.user._id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
