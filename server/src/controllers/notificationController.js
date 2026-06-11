import {
  createNotificationForUser,
  getUserNotifications,
  markUserNotificationsRead,
} from "../services/notificationService.js";

import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

export const listMyNotifications = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const limit = Number(req.query?.limit || 10);

  const notifications = await getUserNotifications(userId, { limit });

  res.status(200).json({
    success: true,
    notifications,
  });
});

export const readAllNotifications = catchAsyncErrors(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const updatedCount = await markUserNotificationsRead(userId);

  res.status(200).json({
    success: true,
    updatedCount,
  });
});

// Optional: allow internal/server-side usage via REST (admin jobs can call it)
export const createNotification = catchAsyncErrors(async (req, res) => {
  const { userId, title, body, type, href, meta, source } = req.body || {};

  const notification = await createNotificationForUser({
    userId,
    title,
    body,
    type,
    href,
    meta,
    source,
  });

  res.status(201).json({
    success: true,
    notification,
  });
});
