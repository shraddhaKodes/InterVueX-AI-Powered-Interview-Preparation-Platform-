import { Problem } from "../models/ProblemSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const createProblemService = async ({ payload, userId }) => {
  const { title, slug, difficulty, description } = payload;

  // ensure slug uniqueness
  const existing = await Problem.findOne({ slug });
  if (existing) {
    throw new ErrorHandler("Slug already exists", 400);
  }

  const problem = await Problem.create({
    title,
    slug,
    difficulty,
    description,
    examples: payload.examples || [],
    constraints: payload.constraints || [],
    starterCode: payload.starterCode || {},
    visibleTestCases: payload.visibleTestCases || [],
    hiddenTestCases: payload.hiddenTestCases || [],
    tags: payload.tags || [],
    createdBy: userId,
  });

  return problem;
};

export const updateProblemService = async ({ id, payload, userId }) => {
  const problem = await Problem.findById(id).select("+hiddenTestCases");
  if (!problem) throw new ErrorHandler("Problem not found", 404);

  if (payload.slug && payload.slug !== problem.slug) {
    const existing = await Problem.findOne({ slug: payload.slug });
    if (existing && existing._id.toString() !== id) {
      throw new ErrorHandler("Slug already exists", 400);
    }
  }

  problem.title = payload.title;
  problem.slug = payload.slug;
  problem.difficulty = payload.difficulty;
  problem.description = payload.description;
  problem.examples = payload.examples || [];
  problem.constraints = payload.constraints || [];
  problem.starterCode = payload.starterCode || {};
  problem.visibleTestCases = payload.visibleTestCases || [];
  problem.hiddenTestCases = payload.hiddenTestCases || [];
  problem.tags = payload.tags || [];

  await problem.save();
  return problem;
};

export const deleteProblemService = async ({ id }) => {
  const problem = await Problem.findById(id);
  if (!problem) throw new ErrorHandler("Problem not found", 404);
  await problem.deleteOne();
  return;
};
