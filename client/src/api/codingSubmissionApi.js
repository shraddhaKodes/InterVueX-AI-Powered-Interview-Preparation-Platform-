import api from "./authApi.js";

const unwrapData = (response) => response.data?.data || response.data;

export const listSubmissions = (params) =>
  api.get("/coding-submissions", { params }).then(unwrapData);
export const getSubmission = (id) =>
  api.get(`/coding-submissions/${id}`).then(unwrapData);

export default api;
