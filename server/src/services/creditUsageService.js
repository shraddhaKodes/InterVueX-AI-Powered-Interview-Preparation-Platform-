import { CreditUsage } from "../models/CreditUsageSchema.js";
import { User } from "../models/UserSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";

export const consumeCreditsService = async (userId, payload) => {
  const creditsConsumed = Number(payload.creditsConsumed);

  if (creditsConsumed < 0) {
    throw new ErrorHandler("Credits consumed cannot be negative", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  if (user.credits < creditsConsumed) {
    throw new ErrorHandler("Insufficient credits", 400);
  }

  user.credits -= creditsConsumed;
  await user.save({ validateBeforeSave: false });

  return await CreditUsage.create({
    user: userId,
    featureUsed: payload.featureUsed,
    creditsConsumed,
    remainingCredits: user.credits,
    usageDate: payload.usageDate || new Date(),
  });
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
