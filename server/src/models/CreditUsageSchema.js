import mongoose from "mongoose";

const creditUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    featureUsed: {
      type: String,
      required: true,
      enum: [
        "ai-interview",
        "mock-interview",
        "resume-analysis",
        "coding-arena",
        "analytics-report",
        "premium-feedback",
        "credit-purchase",
        "admin-adjustment",
      ],
      index: true,
    },

    creditsConsumed: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    remainingCredits: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    usageDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

creditUsageSchema.index({ user: 1, usageDate: -1 });
creditUsageSchema.index({ user: 1, featureUsed: 1 });

export const CreditUsage = mongoose.model(
  "CreditUsage",
  creditUsageSchema
);
