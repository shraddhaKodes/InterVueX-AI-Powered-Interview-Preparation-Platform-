// Small helper to standardize socket notification emission.
// Payload shape should match Topbar.jsx expectations.

export const notifyUser = (io, userId, payload) => {
  if (!io || !userId) return;
  io.to(String(userId)).emit("notifications:new", payload);
};

export const notifyAdminBroadcast = (io, payload) => {
  if (!io) return;
  io.emit("admin:announcement", payload);
};
