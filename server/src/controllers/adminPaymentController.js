import { Payment } from "../models/PaymentSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

export const getAdminPaymentHistory = catchAsyncErrors(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 100);
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(limit, 1), 1000)
    : 100;
  const skip = (page - 1) * safeLimit;

  const payments = await Payment.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .populate("user", "fullName email role");

  res.status(200).json({
    success: true,
    data: {
      payments,
      page,
      limit: safeLimit,
      total: await Payment.countDocuments({}),
    },
  });
});
