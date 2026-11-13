import axiosInstance from "./axiosInstance";

export const getComments = async (reviewId) => {
  const { data } = await axiosInstance.get(`/reviews/${reviewId}/comments`);
  return data;
};

export const addComment = async ({ reviewId, text, parentComment }) => {
  const { data } = await axiosInstance.post(`/reviews/${reviewId}/comments`, {
    text,
    parentComment,
  });
  return data;
};

export const updateComment = async ({ reviewId, id, text }) => {
  const { data } = await axiosInstance.patch(`/reviews/${reviewId}/comments/${id}`, { text });
  return data;
};

export const deleteComment = async ({ reviewId, id }) => {
  await axiosInstance.delete(`/reviews/${reviewId}/comments/${id}`);
};
