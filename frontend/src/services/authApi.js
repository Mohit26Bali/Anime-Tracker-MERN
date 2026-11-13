import axiosInstance from "./axiosInstance";

export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await axiosInstance.patch("/auth/password", { currentPassword, newPassword });
  return data;
};
