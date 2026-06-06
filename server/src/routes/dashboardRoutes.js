import express from "express";
import {
  getAchievements,
  getAnalytics,
  getInterviews,
  getOverview,
  getPayments,
  getRecommendations,
  getSettings,
  getTimeline,
} from "../controllers/dashboardController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/overview", getOverview);
router.get("/interviews", getInterviews);
router.get("/analytics", getAnalytics);
router.get("/recommendations", getRecommendations);
router.get("/timeline", getTimeline);
router.get("/achievements", getAchievements);
router.get("/payments", getPayments);
router.get("/settings", getSettings);

export default router;
