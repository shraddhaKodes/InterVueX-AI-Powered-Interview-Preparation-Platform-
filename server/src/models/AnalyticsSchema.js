import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "interview",
        "mock-interview",
        "resume-analysis",
        "coding-submission",
        "payment",
        "credit-usage",
        "login",
        "profile-update",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    totalInterviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalCodingProblems: {
      type: Number,
      min: 0,
      default: 0,
    },

    averageScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    streak: {
      type: Number,
      min: 0,
      default: 0,
    },

    activityLogs: {
      type: [activityLogSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ user: 1, updatedAt: -1 });
analyticsSchema.index({ "activityLogs.loggedAt": -1 });

export const Analytics = mongoose.model(
  "Analytics",
  analyticsSchema
);
