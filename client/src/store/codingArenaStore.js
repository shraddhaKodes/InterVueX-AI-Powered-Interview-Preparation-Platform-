import { create } from "zustand";
import * as api from "../api/codingArenaApi";

export const useCodingArenaStore = create((set) => ({
  problems: [],
  problem: null,
  lastRun: null,
  lastSubmission: null,
  error: null,
  running: false,
  submitting: false,
  loading: false, // kept for backward compatibility if referenced elsewhere

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
    set({
      running: true,
      error: null,
      lastRun: null,
      submitting: false,
      loading: false,
    });
    try {
      const res = await api.runCode(payload);
      set({
        lastRun: res.execution || res,
        lastSubmission: null,
        running: false,
        loading: false,
      });
      return res;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to run code";
      set({ error: message, running: false, loading: false });
      throw err;
    }
  },

  submitSolution: async (payload) => {
    set({
      submitting: true,
      error: null,
      lastSubmission: null,
      running: false,
      loading: false,
    });
    try {
      const res = await api.submitSolution(payload);
      set({
        lastRun: null,
        lastSubmission: res,
        submitting: false,
        loading: false,
        error: null,
      });
      return res;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to submit code";
      set({ error: message, submitting: false, loading: false });
      throw err;
    }
  },
}));
