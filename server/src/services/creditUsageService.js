import { CreditUsage } from "../models/CreditUsageSchema.js";
import { User } from "../models/UserSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";
import { FEATURE_CREDITS } from "../config/featureCredits.js";

const FEATURE_CREDIT_ALIASES = {
  "ai-interview": "Generate Interview Questions",
  "mock-interview": "Submit Interview for AI Evaluation",
  "resume-analysis": "Resume Upload + Analysis",
  "coding-arena": "Submit Solution",
};

const normalizeCreditsConsumed = (creditsConsumed) => {
  const credits = Number(creditsConsumed);

  if (!Number.isFinite(credits) || credits < 0) {
    throw new ErrorHandler("Credits consumed must be a non-negative number", 400);
  }

  return credits;
};

export const ensureSufficientCreditsService = async (userId, creditsRequired) => {
  const creditsConsumed = normalizeCreditsConsumed(creditsRequired);
  const user = await User.findById(userId).select("credits");

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  if (user.credits < creditsConsumed) {
    throw new ErrorHandler("Insufficient credits", 400);
  }

  return user;
};

export const consumeCreditsService = async (userId, payload) => {
  const creditsConsumed = normalizeCreditsConsumed(payload.creditsConsumed);
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      credits: { $gte: creditsConsumed },
    },
    { $inc: { credits: -creditsConsumed } },
    {
      new: true,
      runValidators: false,
    },
  ).select("credits");

  if (!user) {
    await ensureSufficientCreditsService(userId, creditsConsumed);
    throw new ErrorHandler("Unable to consume credits. Please try again.", 409);
  }

  try {
    return await CreditUsage.create({
      user: userId,
      featureUsed: payload.featureUsed,
      creditsConsumed,
      remainingCredits: user.credits,
      usageDate: payload.usageDate || new Date(),
    });
  } catch (error) {
    await User.updateOne({ _id: userId }, { $inc: { credits: creditsConsumed } });
    throw error;
  }
};

export const getCreditHistoryService = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };

  if (query.featureUsed) filter.featureUsed = query.featureUsed;

  const [creditUsage, total] = await Promise.all([
    CreditUsage.find(filter).sort(getSort(query, "-usageDate")).skip(skip).limit(limit),
    CreditUsage.countDocuments(filter),
  ]);

  return {
    creditUsage,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const SufficientCreditsCheck = async (userId, featureUsed) => {
  const featureCreditKey = FEATURE_CREDIT_ALIASES[featureUsed] || featureUsed;
  const creditsRequired = FEATURE_CREDITS[featureCreditKey];

  if (creditsRequired === undefined) {
    throw new ErrorHandler("Invalid feature used", 400);
  }

  const user = await User.findById(userId).select("credits");

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  const creditsNeeded = Math.max(creditsRequired - user.credits, 0);

  return {
    hasSufficientCredits: creditsNeeded === 0,
    creditsNeeded,
    creditsRequired,
    creditsRemaining: user.credits,
  };
};
