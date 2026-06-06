import { create } from "zustand";
import * as api from "../api/problemAdminApi.js";
import * as publicApi from "../api/codingArenaApi.js";
import { toast } from "react-toastify";

export const useProblemAdminStore = create((set, get) => ({
  problems: [],
  loading: false,
  error: null,

  fetchProblems: async (params) => {
    set({ loading: true });
    try {
      const res = await publicApi.listProblems(params);
      set({ problems: res.problems || [], loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch problems",
      );
    }
  },

  createProblem: async (payload) => {
    set({ loading: true });
    try {
      const res = await api.createProblem(payload);
      // optimistic update
      set((state) => ({
        problems: [res.problem, ...state.problems],
        loading: false,
      }));
      toast.success("Problem created");
      return res.problem;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(
        err.response?.data?.message || err.message || "Create failed",
      );
      throw err;
    }
  },

  updateProblem: async (id, payload) => {
    set({ loading: true });
    try {
      const res = await api.updateProblem(id, payload);
      set((state) => ({
        problems: state.problems.map((p) => (p._id === id ? res.problem : p)),
        loading: false,
      }));
      toast.success("Problem updated");
      return res.problem;
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(
        err.response?.data?.message || err.message || "Update failed",
      );
      throw err;
    }
  },

  deleteProblem: async (id) => {
    const prev = get().problems;
    set({ loading: true, problems: prev.filter((p) => p._id !== id) });
    try {
      const res = await api.deleteProblem(id);
      set({ loading: false });
      toast.success("Problem deleted");
      return res;
    } catch (err) {
      set({ problems: prev, loading: false, error: err.message });
      toast.error(
        err.response?.data?.message || err.message || "Delete failed",
      );
      throw err;
    }
  },
}));
