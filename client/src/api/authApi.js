import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("intervuex_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = async (payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await api.post("/auth/register", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const loginWithGoogle = async (idToken) => {
  const { data } = await api.post("/auth/google", { idToken });
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/password/forgot", payload);
  return data;
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  const { data } = await api.put(`/auth/password/reset/${token}`, {
    password,
    confirmPassword,
  });
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get("/user/me");
  return data;
};

export default api;
