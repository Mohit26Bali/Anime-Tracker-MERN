import * as animeService from "../services/animeService.js";

export const getTrending = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const result = await animeService.getTrending({
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await animeService.getAnimeDetails(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const result = await animeService.getRecommendations(Number(req.params.id), {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q, page, perPage, genre, tag, format, status, sort, season, seasonYear } = req.query;
    const result = await animeService.searchAnime({
      search: q,
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
      genre,
      tag,
      format,
      status,
      sort,
      season,
      seasonYear: seasonYear ? Number(seasonYear) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
