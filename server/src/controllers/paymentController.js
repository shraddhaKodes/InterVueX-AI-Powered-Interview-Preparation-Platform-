import mongoose from "mongoose";
import { Payment } from "../models/PaymentSchema.js";
import { User } from "../models/UserSchema.js";
import { CREDIT_PACKS } from "../config/creditPacks.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const RAZORPAY_SUCCESS_EVENTS = new Set([
  "payment.captured",
  "payment.authorized",
  "order.paid",
]);
const RAZORPAY_SUCCESS_STATUSES = new Set(["captured", "authorized", "paid"]);
const TERMINAL_PAYMENT_STATUSES = new Set(["failed", "cancelled", "refunded"]);
const IN_PROGRESS_PAYMENT_STATUSES = new Set(["processing"]);

const emitCreditsUpdate = (userId, credits) => {
  const io = globalThis.__io;
  if (!io || !userId) return;

  io.to(String(userId)).emit("credits:updated", {
    credits,
  });
};

const buildRazorpaySignature = (payload, secret) =>
  crypto.createHmac("sha256", secret).update(payload).digest("hex");

const isCreditEligibleEvent = (eventName, paymentEntityStatus) =>
  RAZORPAY_SUCCESS_EVENTS.has(eventName) ||
  RAZORPAY_SUCCESS_STATUSES.has(paymentEntityStatus);

const isTerminalPaymentStatus = (status) =>
  TERMINAL_PAYMENT_STATUSES.has(status);

const isProcessingPayment = (status) =>
  IN_PROGRESS_PAYMENT_STATUSES.has(status);

const markPaymentState = async ({ paymentId, status, updateData = {}, session }) => {
  const query = {
    _id: paymentId,
    status: status === "processing" ? "pending" : { $in: ["pending", "processing"] },
    creditsCredited: false,
  };

  return Payment.findOneAndUpdate(
    query,
    {
      $set: {
        ...updateData,
        status,
        transactionDate: new Date(),
      },
    },
    { new: true, session },
  );
};

const finalizePayment = async ({
  paymentId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Fetch the absolute latest state within the transaction to avoid stale objects
    const currentPayment = await Payment.findById(paymentId).session(session);

    if (!currentPayment) {
      throw new Error("Payment record not found.");
    }

    // 2. If already fully processed, exit early cleanly (Idempotent)
    if (
      currentPayment.status === "completed" &&
      currentPayment.creditsCredited
    ) {
      await session.commitTransaction();
      return {
        success: true,
        alreadyProcessed: true,
        payment: currentPayment,
      };
    }

    // 3. If in a hard terminal state, prevent duplication/illegal crediting
    if (isTerminalPaymentStatus(currentPayment.status)) {
      throw new Error(
        "Payment cannot be credited because it is in a terminal failure state.",
      );
    }

    // 4. Concurrency lock check: If another process/webhook thread is working on this, throw a temporary error
    if (isProcessingPayment(currentPayment.status)) {
      throw new Error("Payment processing conflict. Another thread is working on this record.");
    }

    // 5. Atomically move status from 'pending' -> 'processing' inside transaction
    const claimedPayment = await markPaymentState({
      paymentId: currentPayment._id,
      status: "processing",
      updateData: {},
      session,
    });

    if (!claimedPayment) {
      throw new Error("Conflict detected. Concurrency lock acquisition failed.");
    }

    // 6. Credit user's wallet
    const updatedUser = await User.findByIdAndUpdate(
      claimedPayment.user,
      { $inc: { credits: claimedPayment.creditsPurchased } },
      { new: true, session },
    );

    if (!updatedUser) {
      throw new Error(
        "Unable to credit user balance after payment confirmation.",
      );
    }

    // 7. Complete execution state transition
    const finalizedPayment = await Payment.findByIdAndUpdate(
      claimedPayment._id,
      {
        $set: {
          razorpayPaymentId,
          razorpaySignature,
          status: "completed",
          creditsCredited: true,
          creditedAt: new Date(),
          transactionDate: new Date(),
        },
      },
      { new: true, session },
    );

    await session.commitTransaction();

    // 8. Safely emit changes post-commit
    emitCreditsUpdate(updatedUser._id, updatedUser.credits);

    return {
      success: true,
      alreadyProcessed: false,
      payment: finalizedPayment,
      updatedUser,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// 🎯 Create Order (For Checkout Popup)
export const createOrder = async (req, res) => {
  try {
    const { packType } = req.body;
    const pack = CREDIT_PACKS[packType];

    if (!pack) {
      return res.status(400).json({
        success: false,
        message: "Invalid credit pack selection.",
      });
    }

    // BACKEND CONVERSION ONLY: Razorpay requires paise subunits
    const order = await razorpay.orders.create({
      amount: Math.round(pack.amount * 100),
      currency: "INR",
    });

    // Save standard raw currency format (Rupees) into database
    await Payment.create({
      user: req.user.id,
      amount: pack.amount,
      creditsPurchased: pack.credits,
      razorpayOrderId: order.id,
      status: "pending",
      paymentMethod: "razorpay",
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: pack.amount, // Hand clean Rupee values back to client
      credits: pack.credits,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Order process failure details:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initialize order request token.",
    });
  }
};

// 🎯 Verify Payment (Client-facing verification route)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing confirmation parameters.",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Transaction mapping context mismatch.",
      });
    }

    const generatedSignature = buildRazorpaySignature(
      `${razorpay_order_id}|${razorpay_payment_id}`,
      process.env.RAZORPAY_KEY_SECRET,
    );

    if (generatedSignature !== razorpay_signature) {
      await markPaymentState({
        paymentId: payment._id,
        status: "failed",
        updateData: {},
        session: null,
      });
      return res.status(400).json({
        success: false,
        message: "Invalid payment token signature verification.",
      });
    }

    const result = await finalizePayment({
      paymentId: payment._id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: result.alreadyProcessed
        ? "Payment was already verified. Credits remain available."
        : "Transaction verified successfully. Credits deposited.",
    });
  } catch (error) {
    if (error.message.includes("conflict") || error.message.includes("Conflict")) {
      return res.status(409).json({
        success: false,
        message: "Payment transaction is currently being completed. Please refresh your wallet shortly.",
      });
    }
    console.error("Verification processing failure:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎯 Razorpay Webhook Handler
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.get("x-razorpay-signature");
    if (!signature || !req.rawBody) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay webhook signature.",
      });
    }

    const expectedSignature = buildRazorpaySignature(
      req.rawBody,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay webhook signature.",
      });
    }

    const event = req.body;
    const paymentEntity = event?.payload?.payment?.entity;
    const eventName = event?.event;

    if (!paymentEntity?.order_id) {
      return res.status(400).json({
        success: false,
        message: "Webhook payload missing order details.",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: paymentEntity.order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Transaction mapping context mismatch for webhook event.",
      });
    }

    const shouldCredit = isCreditEligibleEvent(
      eventName,
      paymentEntity?.status,
    );

    if (!shouldCredit) {
      if (eventName === "payment.failed") {
        await markPaymentState({
          paymentId: payment._id,
          status: "failed",
          updateData: {},
          session: null,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Webhook processed without crediting the wallet.",
      });
    }

    await finalizePayment({
      paymentId: payment._id,
      razorpayPaymentId: paymentEntity.id,
      razorpaySignature: signature,
    });

    res.status(200).json({
      success: true,
      message: "Payment credits synced via webhook.",
    });
  } catch (error) {
    // 💡 Crucial Concurrency Guard: If a lock collision occurs, return HTTP 409. 
    // This explicitly commands Razorpay to queue and retry this webhook event later.
    if (error.message.includes("conflict") || error.message.includes("Conflict")) {
      return res.status(409).json({ 
        success: false, 
        message: "Temporary database conflict state. Awaiting parallel thread termination." 
      });
    }
    console.error("Razorpay webhook failure:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎯 Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
