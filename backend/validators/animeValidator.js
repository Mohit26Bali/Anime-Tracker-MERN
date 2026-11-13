import { query, param } from "express-validator";

export const getAnimeByIdValidator = [
  param("id").isInt().withMessage("id must be an integer"),
];

const paginationValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("perPage")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("perPage must be between 1 and 50"),
];

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const FORMATS = ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"];
const STATUSES = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"];
const SORTS = ["SEARCH_MATCH", "POPULARITY_DESC", "SCORE_DESC", "TRENDING_DESC", "START_DATE_DESC"];

const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];

const filterValidator = [
  query("genre").optional().isIn(GENRES).withMessage("Invalid genre"),
  query("tag").optional().trim().notEmpty().withMessage("tag must not be empty"),
  query("format").optional().isIn(FORMATS).withMessage("Invalid format"),
  query("status").optional().isIn(STATUSES).withMessage("Invalid status"),
  query("sort").optional().isIn(SORTS).withMessage("Invalid sort option"),
  query("season").optional().isIn(SEASONS).withMessage("Invalid season"),
  query("seasonYear")
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("seasonYear must be a valid year"),
];

export const searchAnimeValidator = [
  query("q").optional().trim(),
  ...paginationValidator,
  ...filterValidator,
];

export const trendingAnimeValidator = [...paginationValidator];

export const recommendationsValidator = [
  param("id").isInt().withMessage("id must be an integer"),
  ...paginationValidator,
];
