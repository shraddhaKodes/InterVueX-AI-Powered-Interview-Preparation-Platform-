import { create } from "zustand";
import { analyzeResume } from "../api/resumeAnalyzeApi.js";

const normalizeImprovements = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) =>
    typeof item === "string"
      ? { title: "Improvement", text: item }
      : item
  );
};

export const useResumeAnalysisStore = create((set) => ({
  loading: false,
  score: null,
  feedbackSummary: "",
  feedbackSections: [],
  suggestedImprovements: [],
  extractedSkills: [],
  missingSkills: [],
  error: null,

  analyze: async (file) => {
    if (!file) return;

    set({
      loading: true,
      error: null,
      score: null,
      feedbackSummary: "",
      feedbackSections: [],
      suggestedImprovements: [],
      extractedSkills: [],
      missingSkills: [],
    });

    try {
      const res = await analyzeResume(file);

      const analysis = res?.resumeAnalysis;

      set({
        score: analysis?.ATSScore ?? 0,

        extractedSkills: analysis?.extractedSkills ?? [],
        missingSkills: analysis?.missingSkills ?? [],

        // FIXED STRUCTURE FROM YOUR DB
        feedbackSummary: analysis?.feedback?.summary ?? "",
        feedbackSections: analysis?.feedback?.sections ?? [],

        suggestedImprovements: normalizeImprovements(
          analysis?.suggestedImprovements
        ),
      });
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Resume analysis failed",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
