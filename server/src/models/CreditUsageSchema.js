import mongoose from "mongoose";

const creditUsageSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  featureUsed: {
    type: String,
    enum: [
      "ai-interview",
      "mock-interview",
      "resume-analysis",
      "coding-arena",
      "analytics-report",
      "premium-feedback",
    ],
    required: true,
  },

  creditsConsumed: {
    type: Number,
    required: true,
    min: 0,
  },
},
{
  timestamps: true,
}
);

creditUsageSchema.index({ user: 1, createdAt: -1 });

export const CreditUsage = mongoose.model(
  "CreditUsage",
  creditUsageSchema
);