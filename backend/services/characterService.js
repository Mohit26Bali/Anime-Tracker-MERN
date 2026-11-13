import graphqlRequest from "./anilist/anilistClient.js";
import characterDetailsQuery from "./anilist/queries/characterDetailsQuery.js";
import charactersSearchQuery from "./anilist/queries/charactersSearchQuery.js";
import { mapCharacterDetails, mapCharacterSearchList } from "./anilist/mappers/characterMapper.js";
import { getCached, setCached } from "../utils/cache.js";

const CACHE_TTL_MS = 5 * 60 * 1000;

export const getCharacterDetails = async (id) => {
  const cacheKey = `character:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let data;
  try {
    data = await graphqlRequest(characterDetailsQuery, { id });
  } catch (error) {
    if (error.statusCode === 404) error.message = "Character not found";
    throw error;
  }

  if (!data.Character) {
    const error = new Error("Character not found");
    error.statusCode = 404;
    throw error;
  }

  const result = mapCharacterDetails(data.Character);
  setCached(cacheKey, result, CACHE_TTL_MS);
  return result;
};

export const searchCharacters = async ({ search, page = 1, perPage = 10 }) => {
  const cacheKey = `characterSearch:${search}:${page}:${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await graphqlRequest(charactersSearchQuery, { search, page, perPage });

  const result = {
    pageInfo: data.Page.pageInfo,
    results: mapCharacterSearchList(data.Page.characters),
  };

  setCached(cacheKey, result, CACHE_TTL_MS);
  return result;
};
