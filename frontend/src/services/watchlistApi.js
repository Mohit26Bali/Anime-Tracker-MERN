import axiosInstance from "./axiosInstance";

export const getWatchlist = async () => {
  const { data } = await axiosInstance.get("/watchlist");
  return data;
};

export const addToWatchlist = async ({ animeId, status }) => {
  const { data } = await axiosInstance.post("/watchlist", { animeId, status });
  return data;
};

export const updateWatchlistStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`/watchlist/${id}`, { status });
  return data;
};

export const removeFromWatchlist = async (id) => {
  await axiosInstance.delete(`/watchlist/${id}`);
};
