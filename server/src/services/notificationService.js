import { Notification } from "../models/index.js";

import { notifyUser } from "../utils/notifySocket.js";

// Note: Socket.IO instance is attached to globalThis by `initSocket`.
const getIO = () => globalThis.__io;

export const createNotificationForUser = async ({
  userId,
  title,
  body = "",
  type = "info",
  href = "",
  meta = {},
  source = "",
}) => {
  if (!userId) return null;
  if (!title) title = "Notification";

  const notification = await Notification.create({
    user: userId,
    title,
    body,
    type,
    href,
    meta,
    source,
    read: false,
  });

  // Emit in real-time for online user(s)
  try {
    const io = getIO();
    console.log(
      "[notify] createNotificationForUser userId=",
      userId,
      "io?=",
      Boolean(io),
    );

    console.log(
      "[notify] notification created (read=)",
      notification?.read,
      "id=",
      notification?._id,
    );

    if (io) {
      console.log(
        "[notify] emitting notifications:new to room",
        String(userId),
        "(type=",
        typeof userId,
        ")",
      );

      notifyUser(io, userId, {
        id: notification._id,
        _id: notification._id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
        href: notification.href,
        meta: notification.meta,
        source: notification.source,
      });
    }
  } catch (e) {
    console.log("[notify] emit error:", e?.message || e);
    // ignore socket emission errors; persistence is primary
  }

  return notification;
};

export const getUserNotifications = async (userId, { limit = 10 } = {}) => {
  if (!userId) return [];
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(Math.max(Number(limit) || 10, 1))
    .lean();

  return notifications.map((n) => ({
    id: n._id,
    _id: n._id,
    user: n.user,
    type: n.type,
    title: n.title,
    body: n.body,
    href: n.href,
    read: n.read,
    createdAt: n.createdAt,
    meta: n.meta,
    source: n.source,
  }));
};

export const markUserNotificationsRead = async (userId) => {
  if (!userId) return 0;

  const result = await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true } },
  );

  // Socket event is optional; client currently only uses it to mark local state.
  try {
    const io = getIO();
    if (io) {
      io.to(String(userId)).emit("notifications:read");
    }
  } catch {
    // ignore
  }

  return result?.modifiedCount || result?.nModified || 0;
};
