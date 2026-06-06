import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "paypal", "stripe", "razorpay", "other"],
      default: "other",
    },

    transactionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ user: 1, transactionDate: -1 });
paymentSchema.index({ user: 1, status: 1 });

export const Payment = mongoose.model(
  "Payment",
  paymentSchema
);
