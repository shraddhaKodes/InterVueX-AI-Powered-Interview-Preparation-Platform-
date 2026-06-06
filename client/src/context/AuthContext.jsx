import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  loginWithGoogle,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
} from "../api/authApi.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "intervuex_token";
const USER_KEY = "intervuex_user";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(getStoredToken()),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsAuthenticated(Boolean(token));
  }, [token]);

  const saveSession = (data) => {
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    }

    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });
      saveSession(data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to sign in.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await registerUser(payload);
      saveSession(data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to sign up.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginWithGoogle(idToken);
      saveSession(data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unable to sign in.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await forgotPasswordRequest({ email });
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to send reset email.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await resetPasswordRequest({
        token,
        password,
        confirmPassword,
      });
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to reset password.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        googleLogin,
        forgotPassword,
        resetPassword,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
