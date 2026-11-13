import axiosInstance from "./axiosInstance";

export const getFavorites = async () => {
  const { data } = await axiosInstance.get("/favorites");
  return data;
};

export const addFavorite = async (animeId) => {
  const { data } = await axiosInstance.post("/favorites", { animeId });
  return data;
};

export const removeFavorite = async (id) => {
  await axiosInstance.delete(`/favorites/${id}`);
};
