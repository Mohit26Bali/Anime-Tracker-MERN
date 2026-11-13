import axiosInstance from "./axiosInstance";

export const searchAnime = async ({
  q,
  pageParam = 1,
  perPage = 20,
  genre,
  format,
  status,
  sort,
  season,
  seasonYear,
}) => {
  const { data } = await axiosInstance.get("/anime/search", {
    params: { q, page: pageParam, perPage, genre, format, status, sort, season, seasonYear },
  });
  return data;
};

export const getAnimeDetails = async (id) => {
  const { data } = await axiosInstance.get(`/anime/${id}`);
  return data;
};

export const getRecommendations = async (id) => {
  const { data } = await axiosInstance.get(`/anime/${id}/recommendations`);
  return data;
};

export const getTrending = async ({ page = 1, perPage = 20 } = {}) => {
  const { data } = await axiosInstance.get("/anime/trending", { params: { page, perPage } });
  return data;
};
