import { create } from "zustand";
import * as api from "../api/codingArenaApi";

export const useCodingArenaStore = create((set) => ({
  problems: [],
  problem: null,
  lastRun: null,
  lastSubmission: null,
  error: null,
  loading: false,

  fetchProblems: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await api.listProblems(params);
      set({ problems: res.problems || [], loading: false });
      return res;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to load problems";
      set({ error: message, loading: false });
      throw err;
    }
  },

  fetchProblem: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.getProblem(id);
      set({ problem: res.problem || null, loading: false });
      return res;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to load problem";
      set({ error: message, loading: false });
      throw err;
    }
  },

  runCode: async (payload) => {
    set({ loading: true, error: null, lastRun: null });
    try {
      const res = await api.runCode(payload);
      set({ lastRun: res.execution || res, lastSubmission: null, loading: false });
      return res;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to run code";
      set({ error: message, loading: false });
      throw err;
    }
  },

  submitSolution: async (payload) => {
    set({ loading: true, error: null, lastSubmission: null });
    try {
      const res = await api.submitSolution(payload);
      set({ lastRun: null, lastSubmission: res, loading: false });
      return res;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to submit code";
      set({ error: message, loading: false });
      throw err;
    }
  },
}));
