import axiosInstance from "./axiosInstance";

export const getReviews = async (animeId) => {
  const { data } = await axiosInstance.get(`/reviews/anime/${animeId}`);
  return data;
};

export const createReview = async ({ animeId, rating, review }) => {
  const { data } = await axiosInstance.post("/reviews", { animeId, rating, review });
  return data;
};

export const updateReview = async ({ id, rating, review }) => {
  const { data } = await axiosInstance.patch(`/reviews/${id}`, { rating, review });
  return data;
};

export const deleteReview = async (id) => {
  await axiosInstance.delete(`/reviews/${id}`);
};
