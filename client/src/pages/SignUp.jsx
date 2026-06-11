import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleLoginButton from "../components/auth/GoogleLoginButton.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aboutMe: "",
    password: "",
    avatar: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formDataToSend = new FormData();
    console.log(formDataToSend) ;
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await register(formDataToSend);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
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
          <span className="auth-pill">Build interview confidence</span>
          <h1>
            Join InterVueX and transform your next interview with AI-powered
            practice.
          </h1>
          <p>
            Create an account, launch mock sessions, and receive real-time
            feedback on your technical answers.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="secondary-auth-button mt-6"
          >
            Already have an account?
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-card"
        >
          <div className="auth-card-heading">
            <p className="auth-eyebrow">Create your profile</p>
            <h2>Sign up for InterVueX</h2>
            <p>
              Get access to AI interviews, progress tracking, and expert
              feedback.
            </p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <span>Full Name</span>
              <div className="auth-input-wrap">
                <input
                  type="text"
                  name="fullName"
                  className="auth-input"
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-field">
              <span>Email</span>
              <div className="auth-input-wrap">
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-input"
                  placeholder="Choose a strong password"
                  value={formData.password}
                  onChange={handleChange}
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
            </div>

            <div className="auth-field">
              <span>About you</span>
              <div className="auth-input-wrap">
                <input
                  type="text"
                  name="aboutMe"
                  className="auth-input"
                  placeholder="Your experience or goals"
                  value={formData.aboutMe}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-field">
              <span>Phone</span>
              <div className="auth-input-wrap">
                <input
                  type="text"
                  name="phone"
                  className="auth-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="avatar-upload">
              <div className="avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" />
                ) : (
                  <span>Upload</span>
                )}
              </div>

              <div>
                <strong>Profile photo</strong>
                <small>Add a personal avatar for your profile.</small>
              </div>

              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>Or continue with</p>
            <span />
          </div>

          <GoogleLoginButton
            className="w-full"
            onSuccess={() => navigate("/dashboard")}
            onError={(message) => setError(message)}
          />

          <p className="auth-switch">
            Already registered?{" "}
            <button onClick={() => navigate("/login")}>Sign in</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
