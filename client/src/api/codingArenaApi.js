import api from "./authApi.js";

const unwrapData = (response) => response.data?.data || response.data;

export const listProblems = (params) =>
  api.get("/coding-arena/problems", { params }).then(unwrapData);
export const getProblem = (id) =>
  api.get(`/coding-arena/problems/${id}`).then(unwrapData);
export const runCode = (payload) =>
  api.post("/coding-arena/run", payload).then(unwrapData);
export const submitSolution = (payload) =>
  api.post("/coding-arena/submit", payload).then(unwrapData);

export default api;
