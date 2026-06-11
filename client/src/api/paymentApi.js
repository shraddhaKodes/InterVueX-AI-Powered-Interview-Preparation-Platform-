import api from "./authApi.js";

export const createOrder = async (packIndex) => {
  const { data } = await api.post("/payments/create-order", {
    packType: packIndex,
  });
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await api.post("/payments/verify-payment", payload);
  return data;
};

export const getPaymentHistory = async () => {
  const { data } = await api.get("/payments/history");
  return data;
};
