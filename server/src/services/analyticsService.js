import { Analytics } from "../models/AnalyticsSchema.js";

export const getDashboardAnalyticsService = async (userId) => {
  return await Analytics.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId } },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );
};

export const updateAnalyticsService = async (userId, payload) => {
  const updateFields = {};

  ["totalInterviews", "totalCodingProblems", "averageScore", "streak"].forEach(
    (field) => {
      if (payload[field] !== undefined) {
        updateFields[field] = payload[field];
      }
    },
  );

  const update = {
    ...(Object.keys(updateFields).length ? { $set: updateFields } : {}),
    ...(payload.activityLog
      ? {
          $push: {
            activityLogs: {
              $each: [payload.activityLog],
              $slice: -100,
            },
          },
        }
      : {}),
  };

  if (!Object.keys(update).length) {
    return await getDashboardAnalyticsService(userId);
  }

  return await Analytics.findOneAndUpdate(
    { user: userId },
    update,
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
};
