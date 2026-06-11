import { User } from "../models/UserSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

// Admin-only: list users
export const listUsers = catchAsyncErrors(async (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(limit, 1), 1000)
    : 50;

  const skip = (page - 1) * safeLimit;

  const [users, total] = await Promise.all([
    User.find({})
      .select("fullName email role credits createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    User.countDocuments({}),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
      total,
      page,
      limit: safeLimit,
    },
  });
});
