import express from "express";

import {
  getMe,
  updateProfile,
} from "../controllers/userController.js";

import {
  isAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/me",
  isAuthenticated,
  getMe
);

router.put(
  "/update-profile",
  isAuthenticated,
  updateProfile
);

export default router;