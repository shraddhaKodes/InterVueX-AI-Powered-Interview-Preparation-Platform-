import { create } from "zustand";
import { toast } from "react-toastify";
import * as api from "../api/adminPaymentApi.js";

export const useAdminPaymentsStore = create((set) => ({
  payments: [],
  loading: false,

  fetchPayments: async (params) => {
    set({ loading: true });
    try {
      const res = await api.getAdminPaymentHistory(params);
      // controller may return either array or {payments:[]}
      const payments = Array.isArray(res)
        ? res
        : res?.payments || res?.data?.payments || [];
      set({ payments, loading: false });
    } catch (err) {
      set({ loading: false });
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch payments",
      );
    }
  },
}));
