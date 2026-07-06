import api from "./authApi.js";

// Upload + analyze resume
export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  // Let the browser set the multipart boundary.
  const { data } = await api.post("/resume-analysis", formData);
  return data;
};

// Get all analyses
export const getMyResumeAnalyses = async (params = {}) => {
  const { data } = await api.get("/resume-analysis", { params });
  return data;
};

// Get single analysis
export const getResumeAnalysisById = async (analysisId) => {
  const { data } = await api.get(`/resume-analysis/${analysisId}`);
  return data;
};
