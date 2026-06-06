import api from "./authApi.js";

export const getDashboardOverview = async () => {
  const { data } = await api.get("/dashboard/overview");
  return data;
};

export const getDashboardInterviews = async () => {
  const { data } = await api.get("/dashboard/interviews");
  return data;
};

export const getDashboardAnalytics = async () => {
  const { data } = await api.get("/dashboard/analytics");
  return data;
};

export const getDashboardRecommendations = async () => {
  const { data } = await api.get("/dashboard/recommendations");
  return data;
};

export const getDashboardTimeline = async () => {
  const { data } = await api.get("/dashboard/timeline");
  return data;
};

export const getDashboardAchievements = async () => {
  const { data } = await api.get("/dashboard/achievements");
  return data;
};

export const getDashboardPayments = async () => {
  const { data } = await api.get("/dashboard/payments");
  return data;
};

export const getDashboardSettings = async () => {
  const { data } = await api.get("/dashboard/settings");
  return data;
};
