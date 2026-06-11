import express from "express";

import {
  listMyNotifications,
  readAllNotifications,
  createNotification,
} from "../controllers/notificationController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, listMyNotifications);
router.put("/read-all", isAuthenticated, readAllNotifications);

// Optional: internal/admin usage
router.post("/create", createNotification);

export default router;
