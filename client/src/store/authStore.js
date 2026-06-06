import { create } from "zustand";
import { loginUser, registerUser } from "../api/authApi";

const TOKEN_KEY = "intervuex_token";
const USER_KEY = "intervuex_user";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

const persistSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const data = await loginUser(credentials);
      persistSession(data);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to sign in.";
      set({ error: message, isLoading: false });
      throw new Error(message, { cause: error });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const data = await registerUser(payload);
      persistSession(data);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to create account.";
      set({ error: message, isLoading: false });
      throw new Error(message, { cause: error });
    }
  },

  setGoogleSession: (data) => {
    persistSession(data);

    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
