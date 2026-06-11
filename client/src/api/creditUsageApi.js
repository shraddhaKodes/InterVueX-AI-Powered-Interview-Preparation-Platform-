import api from "./authApi.js";

export const consumeCredits = async (payload) => {
  const { data } = await api.post("/credit-usage/consume", payload);
  return data;
};

export const getCreditHistory = async (query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params.append(k, v);
  });

  const qs = params.toString();
  const url = qs ? `/credit-usage/history?${qs}` : "/credit-usage/history";
  const { data } = await api.get(url);
  return data;
};
