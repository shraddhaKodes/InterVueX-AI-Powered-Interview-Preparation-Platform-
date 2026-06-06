import express from "express";
import {
  getDashboardAnalytics,
  updateAnalytics,
} from "../controllers/analyticsController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.use(isAuthenticated);

/**
 * @route GET /api/analytics/dashboard
 * @desc Get dashboard analytics for authenticated user
 * @access Private
 */
router.get("/dashboard", getDashboardAnalytics);

/**
 * @route PUT /api/analytics/update
 * @desc Update dashboard analytics for authenticated user
 * @access Private
 */
router.put("/update", updateAnalytics);

router
  .route("/")
  .get(getDashboardAnalytics)
  .put(updateAnalytics);

export default router;
