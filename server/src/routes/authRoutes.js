import express from "express";

import {
  register,
  login,
  googleLogin,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { getMe } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.get("/logout", logout);

router.post("/logout", logout);

router.get("/me", isAuthenticated, getMe);

router.post(
  "/password/forgot",
  forgotPassword
);

router.put(
  "/password/reset/:token",
  resetPassword
);

export default router;
