import api from "./authApi.js";

export const getMe = async () => {
  const { data } = await api.get("/user/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/user/update-profile", payload);
  return data;
};
