import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

import {
  getAnalyticsOverviewService,
  getInterviewAnalyticsService,
  getResumeAnalyticsService,
  getCodingAnalyticsService,
  getRecommendationsService,
} from "../services/analyticsService.js";

import { generateAiAnalyticsInsights } from "../services/aiAnalyticsService.js";

// Existing exports (dashboard analytics) are also defined in this file.
// We'll re-export existing ones by importing the same services.

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

export const getAnalyticsOverview = catchAsyncErrors(async (req, res) => {
  const overview = await getAnalyticsOverviewService(req.user.id);
  res.status(200).json({ success: true, overview });
});

export const getInterviewAnalytics = catchAsyncErrors(async (req, res) => {
  const interview = await getInterviewAnalyticsService(req.user.id);
  res.status(200).json({ success: true, interview });
});

export const getResumeAnalytics = catchAsyncErrors(async (req, res) => {
  const resume = await getResumeAnalyticsService(req.user.id);
  res.status(200).json({ success: true, resume });
});

export const getCodingAnalytics = catchAsyncErrors(async (req, res) => {
  const coding = await getCodingAnalyticsService(req.user.id);
  res.status(200).json({ success: true, coding });
});

export const getRecommendations = catchAsyncErrors(async (req, res) => {
  // Cache AI recommendations to avoid costly repeated AI calls.
  // If query ?force=true is provided, regenerate and overwrite the cache.
  const userId = req.user.id;

  const force = String(req.query?.force || "").toLowerCase() === "true";

  const { Analytics } = await import("../models/AnalyticsSchema.js");

  const analyticsDoc = await Analytics.findOne({ user: userId });
  const cached = analyticsDoc?.recommendationsCache;

  const isNonEmptyCache = (c) => {
    if (!c) return false;

    const hasScore =
      typeof c.careerReadinessScore === "number" && c.careerReadinessScore > 0;
    const hasStrengths = Array.isArray(c.strengths) && c.strengths.length > 0;
    const hasWeaknesses =
      Array.isArray(c.weaknesses) && c.weaknesses.length > 0;
    const hasNextSteps = Array.isArray(c.nextSteps) && c.nextSteps.length > 0;
    const hasConfidenceNotes =
      typeof c.confidenceNotes === "string" &&
      c.confidenceNotes.trim().length > 0;

    return (
      hasScore ||
      hasStrengths ||
      hasWeaknesses ||
      hasNextSteps ||
      hasConfidenceNotes
    );
  };

  // If cache exists and is not empty, DO NOT call AI (unless force=true).
  if (!force && isNonEmptyCache(cached)) {
    const recommendations = await getRecommendationsService(userId, cached);
    return res.status(200).json({
      success: true,
      recommendations,
      aiInsights: cached,
      cached: true,
    });
  }

  // Cache is missing/empty (initial state) -> generate and persist.
  const overview = await getAnalyticsOverviewService(userId);

  const interview = await getInterviewAnalyticsService(userId);

  const resume = await getResumeAnalyticsService(userId);

  const coding = await getCodingAnalyticsService(userId);
  const aiInsights = await generateAiAnalyticsInsights({
    user: req.user,
    overview,
    interview,
    resume,
    coding,
  });

  const updated = await Analytics.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        "recommendationsCache.version": aiInsights?.version ?? "v1",

        "recommendationsCache.careerReadinessScore":
          aiInsights?.careerReadinessScore ?? 0,

        "recommendationsCache.strengths": aiInsights?.strengths ?? [],

        "recommendationsCache.weaknesses": aiInsights?.weaknesses ?? [],

        "recommendationsCache.nextSteps": aiInsights?.nextSteps ?? [],

        "recommendationsCache.confidenceNotes":
          aiInsights?.confidenceNotes ?? "",

        "recommendationsCache.generatedAt": new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  const recommendations = await getRecommendationsService(
    userId,
    updated?.recommendationsCache || aiInsights,
  );

  res.status(200).json({
    success: true,
    recommendations,
    aiInsights: updated?.recommendationsCache || aiInsights,
    cached: false,
  });
});
