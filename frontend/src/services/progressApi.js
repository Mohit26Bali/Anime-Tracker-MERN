import axiosInstance from "./axiosInstance";

export const getProgress = async () => {
  const { data } = await axiosInstance.get("/progress");
  return data;
};

export const createProgress = async ({ animeId, currentEpisode }) => {
  const { data } = await axiosInstance.post("/progress", { animeId, currentEpisode });
  return data;
};

export const updateProgress = async ({ id, currentEpisode }) => {
  const { data } = await axiosInstance.patch(`/progress/${id}`, { currentEpisode });
  return data;
};
