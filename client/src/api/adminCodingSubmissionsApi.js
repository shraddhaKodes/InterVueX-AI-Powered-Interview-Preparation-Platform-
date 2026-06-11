import api from "./authApi.js";

const unwrapData = (response) => response.data?.data || response.data;

// Admin-only: list all coding submissions across users
// Must match server route: server mounts adminCodingSubmissionsRoutes at /api/v1/coding-arena
// and inside the router the list route is GET /submissions
export const listAdminSubmissions = (params) =>
  api.get("/coding-arena/submissions", { params }).then(unwrapData);

export const getAdminSubmission = (id, params) =>
  api.get(`/coding-arena/submissions/admin/${id}`, { params }).then(unwrapData);
