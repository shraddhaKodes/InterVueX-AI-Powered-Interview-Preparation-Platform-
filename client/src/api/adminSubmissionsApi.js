import api from "./authApi.js";

const unwrapData = (response) => response.data?.data || response.data;

// Admin-only: list all submissions across users
export const listAdminSubmissions = (params) =>
  api.get("/coding-arena/submissions/admin", { params }).then(unwrapData);

export const getAdminSubmission = (id, params) =>
  api.get(`/coding-arena/submissions/admin/${id}`, { params }).then(unwrapData);
