import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
} from "../../utils/firebase.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const GoogleLoginButton = ({ onSuccess, onError, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleLogin } = useAuth();

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      onError?.("Add your Firebase web app values in client/.env first.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await googleLogin(idToken);
      onSuccess?.(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Google sign-in failed. Please try again.";
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`secondary-auth-button ${className}`}
    >
      {isLoading ? <LoadingSpinner /> : <FcGoogle size={18} />}
      {isLoading ? "Signing in..." : "Continue with Google"}
    </button>
  );
};

export default GoogleLoginButton;
