import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  consumeCreditsService,
  getCreditHistoryService,
} from "../services/creditUsageService.js";

export const consumeCredits = catchAsyncErrors(async (req, res) => {
  const creditUsage = await consumeCreditsService(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Credits consumed successfully",
    creditUsage,
  });
});

export const getCreditHistory = catchAsyncErrors(async (req, res) => {
  const result = await getCreditHistoryService(req.user.id, req.query);

  res.status(200).json({
    success: true,
    message: "Credit history fetched successfully",
    ...result,
  });
});
