import api from "./authApi.js";

const unwrapData = (response) => response.data?.data || response.data;

// Admin-only: list all users
export const listUsers = (params) =>
  api.get("/user/admin/users", { params }).then(unwrapData);

export default { listUsers };
