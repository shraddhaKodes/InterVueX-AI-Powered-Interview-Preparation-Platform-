import { create } from "zustand";
import {
  getDashboardAnalytics,
  getDashboardInterviews,
  getDashboardOverview,
  getDashboardPayments,
} from "../api/dashboardApi.js";

export const useDashboardStore = create((set) => ({
  loading: true,
  stats: [],
  recentInterviews: [],
  analytics: {
    weeklyProgress: [],
    topicPerformance: [],
    scoreTrend: [],
  },
  quickActions: [],
  recommendations: [],
  timeline: [],
  achievements: [],
  interviews: [],
  payments: { balance: 0, transactions: [] },
  overview: {
    userSummary: {
      creditsRemaining: 0,
      streak: 0,
      totalInterviews: 0,
      averageScore: 0,
    },
  },
  error: null,

  initializeDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const { overview } = await getDashboardOverview();

      set({
        overview: overview.userSummary
          ? { userSummary: overview.userSummary }
          : overview,
        stats: overview.stats || [],
        recentInterviews: overview.recentInterviews || [],
        analytics: overview.analytics || {
          weeklyProgress: [],
          topicPerformance: [],
          scoreTrend: [],
        },
        quickActions: overview.quickActions || [],
        recommendations: overview.recommendations || [],
        timeline: overview.timeline || [],
        achievements: overview.achievements || [],
      });
    } catch (err) {
      set({ error: err.message || "Could not load dashboard data." });
    } finally {
      set({ loading: false });
    }
  },

  loadInterviews: async () => {
    set({ loading: true, error: null });

    try {
      const { interviews } = await getDashboardInterviews();
      set({ interviews });
    } catch (err) {
      set({ error: err.message || "Could not load interviews." });
    } finally {
      set({ loading: false });
    }
  },

  loadAnalytics: async () => {
    set({ loading: true, error: null });

    try {
      const { analytics } = await getDashboardAnalytics();
      set({ analytics });
    } catch (err) {
      set({ error: err.message || "Could not load analytics." });
    } finally {
      set({ loading: false });
    }
  },

  loadPayments: async () => {
    set({ loading: true, error: null });

    try {
      const { payments } = await getDashboardPayments();
      set({ payments });
    } catch (err) {
      set({ error: err.message || "Could not load payments." });
    } finally {
      set({ loading: false });
    }
  },
}));
