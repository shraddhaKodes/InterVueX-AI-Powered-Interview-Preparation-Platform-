import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      default: "info",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      default: "",
    },

    href: {
      type: String,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Stores event time when the notification was created.
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Extra metadata for UI/navigation.
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Optional: which feature/source created it.
    source: {
      type: String,
      default: "",
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
