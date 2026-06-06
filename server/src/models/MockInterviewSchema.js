import mongoose from "mongoose";

const mockQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    answer: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    category: {
      type: String,
      enum: ["technical", "behavioral", "system-design", "coding", "hr", "other"],
      default: "technical",
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const mockFeedbackSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    questions: {
      type: [mockQuestionSchema],
      default: [],
    },

    completedQuestions: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.questions.length;
        },
        message: "Completed questions cannot exceed total questions.",
      },
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    feedback: {
      type: mockFeedbackSchema,
      default: () => ({}),
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || !this.startedAt || value >= this.startedAt;
        },
        message: "Completed date cannot be before started date.",
      },
    },
  },
  {
    timestamps: true,
  }
);

mockInterviewSchema.index({ user: 1, createdAt: -1 });
mockInterviewSchema.index({ user: 1, completedAt: -1 });

export const MockInterview = mongoose.model(
  "MockInterview",
  mockInterviewSchema
);
