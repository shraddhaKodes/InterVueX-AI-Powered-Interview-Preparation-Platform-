import { Payment } from "../models/PaymentSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";

export const createPaymentService = async (userId, payload) => {
  return await Payment.create({
    ...payload,
    user: userId,
  });
};

export const verifyPaymentService = async (userId, paymentId, payload) => {
  const payment = await Payment.findOneAndUpdate(
    {
      _id: paymentId,
      user: userId,
    },
    {
      status: payload.status || "completed",
      transactionDate: payload.transactionDate || new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!payment) {
    throw new ErrorHandler("Payment not found", 404);
  }

  return payment;
};

export const getPaymentHistoryService = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };

  if (query.status) filter.status = query.status;
  if (query.currency) filter.currency = query.currency.toUpperCase();

  const [payments, total] = await Promise.all([
    Payment.find(filter).sort(getSort(query, "-transactionDate")).skip(skip).limit(limit),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: buildPaginationMeta(total, page, limit),
  };
};
