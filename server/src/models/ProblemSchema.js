import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    weight: { type: Number, default: 1 },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 240 },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 240,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    description: { type: String, required: true, maxlength: 20000 },
    examples: { type: [String], default: [] },
    constraints: { type: [String], default: [] },
    starterCode: { type: Map, of: String, default: {} },
    visibleTestCases: { type: [testCaseSchema], default: [] },
    hiddenTestCases: { type: [testCaseSchema], default: [], select: false },
    tags: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Problem = mongoose.model("Problem", problemSchema);
