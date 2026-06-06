import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  createPaymentService,
  getPaymentHistoryService,
  verifyPaymentService,
} from "../services/paymentService.js";

export const createPayment = catchAsyncErrors(async (req, res) => {
  const payment = await createPaymentService(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Payment created successfully",
    payment,
  });
});

export const verifyPayment = catchAsyncErrors(async (req, res) => {
  const paymentId = req.params.id || req.body.id || req.body.paymentMongoId;
  const payment = await verifyPaymentService(req.user.id, paymentId, req.body);

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    payment,
  });
});

export const getPaymentHistory = catchAsyncErrors(async (req, res) => {
  const result = await getPaymentHistoryService(req.user.id, req.query);

  res.status(200).json({
    success: true,
    message: "Payment history fetched successfully",
    ...result,
  });
});
