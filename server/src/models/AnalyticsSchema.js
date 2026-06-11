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
  },
);

const recommendationsCacheSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      default: "v1",
    },

    // Business insight payload expected by frontend
    careerReadinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    nextSteps: {
      type: [String],
      default: [],
    },

    confidenceNotes: {
      type: String,
      default: "",
    },

    // When this cache was generated
    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { _id: false },
);

const snapshotsSchema = new mongoose.Schema(
  {
    // analytics window
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    // cached computed overview response
    overview: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    // cached computed module responses (optional)
    modules: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { _id: false },
);
const readinessHistorySchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
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
    jobReadinessLevel: {
      type: String,
      default: "Beginner",
    },

    priorityTopics: {
      type: [String],
      default: [],
    },

    improvementAreas: {
      type: [String],
      default: [],
    },
    readinessHistory: {
      type: [readinessHistorySchema],
      default: [],
    },
    recommendationsCache: {
      type: recommendationsCacheSchema,
      default: () => ({}),
    },

    snapshots: {
      type: [snapshotsSchema],
      default: [],
      // Keep snapshot array bounded (business decision)
    },
  },
  {
    timestamps: true,
  },
);

analyticsSchema.index({ user: 1, updatedAt: -1 });
analyticsSchema.index({ "activityLogs.loggedAt": -1 });
analyticsSchema.index({ "snapshots.generatedAt": -1 });
analyticsSchema.index({ "recommendationsCache.generatedAt": -1 });

export const Analytics = mongoose.model("Analytics", analyticsSchema);
