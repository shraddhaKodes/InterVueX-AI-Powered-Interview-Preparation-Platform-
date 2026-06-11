import { create } from "zustand";

import {
  getAnalyticsOverview,
  getInterviewAnalytics,
  getResumeAnalytics,
  getCodingAnalytics,
  getRecommendations,
} from "../api/analyticsApi.js";

export const useAnalyticsStore = create((set) => ({
  loading: false,
  error: null,

  overview: null,
  interview: null,
  resume: null,
  coding: null,
  recommendations: null,

  loadAllAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const [overviewRes, interviewRes, resumeRes, codingRes, recRes] =
        await Promise.all([
          getAnalyticsOverview(),
          getInterviewAnalytics(),
          getResumeAnalytics(),
          getCodingAnalytics(),
          getRecommendations(),
        ]);

      set({
        overview: overviewRes?.overview || overviewRes,
        interview: interviewRes?.interview || interviewRes,
        resume: resumeRes?.resume || resumeRes,
        coding: codingRes?.coding || codingRes,
        recommendations: recRes?.recommendations || recRes,
      });

      if (recRes?.cached !== undefined) {
        // not required by UI today, but useful for debugging/UX
        set({ aiRecommendationsCached: recRes.cached });
      }
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ||
          err.message ||
          "Failed to load analytics",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
