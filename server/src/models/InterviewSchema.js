import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: ["technical", "behavioral", "system-design", "coding", "hr", "other"],
      default: "technical",
    },

    expectedAnswer: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    _id: false,
  }
);

const answerRubricSchema = new mongoose.Schema(
  {
    correctness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    communication: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    depth: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    tradeoffs: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    codeQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const interviewAnswerSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
      min: 0,
    },

    question: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    answer: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

  feedback: {
  type: [String],
  required: true,
  default: [],
  maxlength: 5000,
  },
    rubric: {
      type: answerRubricSchema,
      default: () => ({}),
    },

    answeredAt: {
      type: Date,
    },

    evaluatedAt: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const interviewFeedbackSchema = new mongoose.Schema(
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

    recommendation: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const aiMetadataSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      trim: true,
      default: "",
    },

    model: {
      type: String,
      trim: true,
      default: "",
    },

    generatedAt: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, //database query optimization for user-based queries
    },

    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    company: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    techStack: {
      type: [String],
      default: [],
    },

    questions: {
      type: [interviewQuestionSchema],
      default: [],
    },

    answers: {
      type: [interviewAnswerSchema],
      default: [],
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    feedback: {
      type: interviewFeedbackSchema,
      default: () => ({}),
    },

    aiMetadata: {
      type: aiMetadataSchema,
      default: () => ({}),
    },

    duration: {
      type: Number,
      min: 0,
      default: 0,
    },

    interviewType: {
      type: String,
      enum: ["ai", "mock", "technical", "behavioral", "system-design", "hr"],
      default: "ai",
    },

    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled", "review"],
      default: "scheduled",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, status: 1 });
interviewSchema.index({ user: 1, interviewType: 1 });

export const Interview = mongoose.model(
  "Interview",
  interviewSchema
);
