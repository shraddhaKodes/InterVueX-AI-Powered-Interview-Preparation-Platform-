import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  getDashboardAnalyticsService,
  updateAnalyticsService,
} from "../services/analyticsService.js";

export const getDashboardAnalytics = catchAsyncErrors(async (req, res) => {
  const analytics = await getDashboardAnalyticsService(req.user.id);

  res.status(200).json({
    success: true,
    message: "Analytics fetched successfully",
    analytics,
  });
});

export const updateAnalytics = catchAsyncErrors(async (req, res) => {
  const analytics = await updateAnalyticsService(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Analytics updated successfully",
    analytics,
  });
});
