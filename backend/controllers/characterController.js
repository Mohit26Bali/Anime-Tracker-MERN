import * as characterService from "../services/characterService.js";

export const getById = async (req, res, next) => {
  try {
    const result = await characterService.getCharacterDetails(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q, page, perPage } = req.query;
    const result = await characterService.searchCharacters({
      search: q,
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
