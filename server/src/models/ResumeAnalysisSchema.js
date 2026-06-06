import mongoose from "mongoose";

const resumeFeedbackSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    sections: {
      type: [String],
      default: [],
    },

    keywordMatches: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    extractedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    ATSScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    feedback: {
      type: resumeFeedbackSchema,
      default: () => ({}),
    },

    suggestedImprovements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

resumeAnalysisSchema.index({ user: 1, createdAt: -1 });
resumeAnalysisSchema.index({ user: 1, ATSScore: -1 });

export const ResumeAnalysis = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);
