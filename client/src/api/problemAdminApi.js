import api from "./authApi.js";

const unwrapData = (response) => response.data?.data || response.data;

export const createProblem = (payload) =>
  api.post("/coding-arena/problems", payload).then(unwrapData);

export const updateProblem = (id, payload) =>
  api.put(`/coding-arena/problems/${id}`, payload).then(unwrapData);

export const deleteProblem = (id) =>
  api.delete(`/coding-arena/problems/${id}`).then(unwrapData);

export default { createProblem, updateProblem, deleteProblem };
