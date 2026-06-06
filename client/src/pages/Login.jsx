import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleLoginButton from "../components/auth/GoogleLoginButton.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-ambient" />

      <div className="auth-grid">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-copy"
        >
          <span className="auth-pill">AI Interview Prep</span>
          <h1>
            Practice smarter.
            <br />
            Interview stronger.
          </h1>
          <p>
            InterVueX helps you rehearse mock interviews, analyze strengths, and
            land your next tech role with confidence.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/signup")}
              className="primary-auth-button"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="secondary-auth-button"
            >
              Recover Account
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-card"
        >
          <div className="auth-card-heading">
            <p className="auth-eyebrow">Welcome back</p>
            <h2>Login to your InterVueX account</h2>
            <p>
              Access AI interview sessions, progress reports and saved mock
              rounds.
            </p>
          </div>

          {(localError || error) && (
            <p className="auth-error">{localError || error}</p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <div className="auth-input-wrap">
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="icon-button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>

            <div className="auth-row">
              <button
                type="button"
                className="auth-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
              <span className="text-slate-400 text-sm">Secure login</span>
            </div>

            <button
              type="submit"
              className="primary-auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <GoogleLoginButton
            className="w-full"
            onSuccess={() => navigate("/dashboard")}
            onError={(message) => setLocalError(message)}
          />

          <p className="auth-switch">
            New to InterVueX?{" "}
            <button onClick={() => navigate("/signup")}>
              Create an account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
