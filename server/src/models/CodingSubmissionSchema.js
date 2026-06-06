import mongoose from "mongoose";

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    problemTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    language: {
      type: String,
      required: true,
      enum: [
        "javascript",
        "typescript",
        "python",
        "java",
        "cpp",
        "c",
        "csharp",
        "go",
        "rust",
        "php",
        "ruby",
        "swift",
        "kotlin",
        "other",
      ],
    },

    sourceCode: {
      type: String,
      maxlength: 200000,
      required: true,
    },

    verdict: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "wrong-answer",
        "time-limit-exceeded",
        "memory-limit-exceeded",
        "runtime-error",
        "compilation-error",
      ],
      default: "pending",
      index: true,
    },

    executionTime: {
      type: Number,
      min: 0,
      default: 0,
    },

    memoryUsage: {
      type: Number,
      min: 0,
      default: 0,
    },

    passedTestCases: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= this.passedTestCases;
        },
        message: "Total test cases cannot be less than passed test cases.",
      },
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    testcaseResults: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

codingSubmissionSchema.index({ user: 1, createdAt: -1 });
codingSubmissionSchema.index({ user: 1, verdict: 1 });
codingSubmissionSchema.index({ user: 1, problemTitle: 1 });

export const CodingSubmission = mongoose.model(
  "CodingSubmission",
  codingSubmissionSchema,
);
