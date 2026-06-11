import api from "./authApi.js";

const unwrapData = (response) => response.data?.data ?? response.data;

// Admin only: all users payment history
export const getAdminPaymentHistory = async (params) => {
  const { data } = await api.get("/payments/admin/history", { params });
  return data?.data ?? data;
};
