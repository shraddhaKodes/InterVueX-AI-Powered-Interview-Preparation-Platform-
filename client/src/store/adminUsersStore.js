import { create } from "zustand";
import * as api from "../api/adminUsersApi.js";
import { toast } from "react-toastify";

export const useAdminUsersStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await api.listUsers(params);
      set({ users: res.users || [], loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch users",
      );
    }
  },
}));
