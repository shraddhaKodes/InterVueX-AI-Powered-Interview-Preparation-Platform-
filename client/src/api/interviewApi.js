import api from "./authApi.js";

export const createInterview = async (payload) => {
  const { data } = await api.post("/interviews", payload);
  return data;
};

export const generateInterviewQuestions = async (interviewId) => {
  const { data } = await api.post(
    `/interviews/${interviewId}/generate-questions`,
  );
  return data;
};

export const submitInterviewAnswer = async (interviewId, payload) => {
  const { data } = await api.post(
    `/interviews/${interviewId}/answers`,
    payload,
  );
  return data;
};

export const getMyInterviews = async (params = {}) => {
  const { data } = await api.get("/interviews", { params });
  return data;
};

export const getInterviewById = async (interviewId) => {
  const { data } = await api.get(`/interviews/${interviewId}`);
  return data;
};
