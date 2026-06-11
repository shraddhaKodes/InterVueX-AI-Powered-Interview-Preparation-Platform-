import api from "./authApi.js";

export const getMyNotifications = async ({ limit = 10 } = {}) => {
  const { data } = await api.get(
    `/notifications?limit=${encodeURIComponent(limit)}`,
  );
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.put(`/notifications/read-all`);
  return data;
};
