import api from "./authApi.js";

export const getAnalyticsOverview = async () => {
  const { data } = await api.get("/analytics/overview");
  return data;
};

export const getInterviewAnalytics = async () => {
  const { data } = await api.get("/analytics/interview");
  return data;
};

export const getResumeAnalytics = async () => {
  const { data } = await api.get("/analytics/resume");
  return data;
};

export const getCodingAnalytics = async () => {
  const { data } = await api.get("/analytics/coding");
  return data;
};

export const getRecommendations = async (options = {}) => {
  const force = options?.force;
  const query = force === true ? "?force=true" : "";

  const { data } = await api.get(`/analytics/recommendations${query}`);
  return data;
};
