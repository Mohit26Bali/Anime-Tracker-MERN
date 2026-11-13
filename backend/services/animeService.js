import graphqlRequest from "./anilist/anilistClient.js";
import searchAnimeQuery from "./anilist/queries/searchAnimeQuery.js";
import animeDetailsQuery from "./anilist/queries/animeDetailsQuery.js";
import trendingAnimeQuery from "./anilist/queries/trendingAnimeQuery.js";
import recommendationsQuery from "./anilist/queries/recommendationsQuery.js";
import {
  mapAnimeList,
  mapAnimeDetails,
  mapRecommendationList,
} from "./anilist/mappers/animeMapper.js";
import { getCached, setCached } from "../utils/cache.js";

const CACHE_TTL_MS = 5 * 60 * 1000;
const TRENDING_CACHE_TTL_MS = 30 * 60 * 1000;

export const searchAnime = async ({
  search,
  page = 1,
  perPage = 20,
  genre,
  tag,
  format,
  status,
  sort,
  season,
  seasonYear,
}) => {
  const trimmedSearch = search?.trim() ? search.trim() : undefined;
  const resolvedSort = sort ? [sort] : trimmedSearch ? ["SEARCH_MATCH"] : ["POPULARITY_DESC"];
  const cacheKey = `search:${trimmedSearch}:${page}:${perPage}:${genre}:${tag}:${format}:${status}:${resolvedSort[0]}:${season}:${seasonYear}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await graphqlRequest(searchAnimeQuery, {
    search: trimmedSearch,
    page,
    perPage,
    genre,
    tag,
    format,
    status,
    sort: resolvedSort,
    season,
    seasonYear,
  });

  const result = {
    pageInfo: data.Page.pageInfo,
    results: mapAnimeList(data.Page.media),
  };

  setCached(cacheKey, result, CACHE_TTL_MS);
  return result;
};

export const getTrending = async ({ page = 1, perPage = 20 }) => {
  const cacheKey = `trending:${page}:${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await graphqlRequest(trendingAnimeQuery, { page, perPage });

  const result = {
    pageInfo: data.Page.pageInfo,
    results: mapAnimeList(data.Page.media),
  };

  setCached(cacheKey, result, TRENDING_CACHE_TTL_MS);
  return result;
};

export const getAnimeDetails = async (id) => {
  const cacheKey = `details:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let data;
  try {
    data = await graphqlRequest(animeDetailsQuery, { id });
  } catch (error) {
    if (error.statusCode === 404) error.message = "Anime not found";
    throw error;
  }

  if (!data.Media) {
    const error = new Error("Anime not found");
    error.statusCode = 404;
    throw error;
  }

  const result = mapAnimeDetails(data.Media);

  setCached(cacheKey, result, CACHE_TTL_MS);
  return result;
};

export const getRecommendations = async (id, { page = 1, perPage = 10 }) => {
  const cacheKey = `recommendations:${id}:${page}:${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let data;
  try {
    data = await graphqlRequest(recommendationsQuery, { id, page, perPage });
  } catch (error) {
    if (error.statusCode === 404) error.message = "Anime not found";
    throw error;
  }

  if (!data.Media) {
    const error = new Error("Anime not found");
    error.statusCode = 404;
    throw error;
  }

  const result = {
    pageInfo: data.Media.recommendations.pageInfo,
    results: mapRecommendationList(data.Media.recommendations.nodes),
  };

  setCached(cacheKey, result, TRENDING_CACHE_TTL_MS);
  return result;
};
