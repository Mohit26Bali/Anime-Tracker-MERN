import axiosInstance from "./axiosInstance";

export const getCharacterDetails = async (id) => {
  const { data } = await axiosInstance.get(`/characters/${id}`);
  return data;
};

export const searchCharacters = async ({ q, pageParam = 1 }) => {
  const { data } = await axiosInstance.get("/characters/search", {
    params: { q, page: pageParam, perPage: 20 },
  });
  return data;
};
