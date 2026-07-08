import { Payment } from "../models/PaymentSchema.js";
import { User } from "../models/UserSchema.js";
import { CREDIT_PACKS } from "../config/creditPacks.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

const emitCreditsUpdate = (userId, credits) => {
  const io = globalThis.__io;
  if (!io || !userId) return;

  io.to(String(userId)).emit("credits:updated", {
    credits,
  });
};

const finalizePayment = async ({
  payment,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (payment.status === "completed" && payment.creditsCredited) {
    return {
      success: true,
      alreadyProcessed: true,
      payment,
    };
  }

  if (
    payment.status === "failed" ||
    payment.status === "cancelled" ||
    payment.status === "refunded"
  ) {
    throw new Error(
      "Payment cannot be credited because it is no longer pending.",
    );
  }

  payment.paymentId = razorpayPaymentId;
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "completed";
  payment.transactionDate = new Date();
  await payment.save();

  const updatedUser = await User.findByIdAndUpdate(
    payment.user,
    { $inc: { credits: payment.creditsPurchased } },
    { new: true },
  );

  if (!updatedUser) {
    throw new Error(
      "Unable to credit user balance after payment confirmation.",
    );
  }

  payment.creditsCredited = true;
  payment.creditedAt = new Date();
  await payment.save();

  emitCreditsUpdate(updatedUser._id, updatedUser.credits);

  return {
    success: true,
    alreadyProcessed: false,
    payment,
    updatedUser,
  };
};

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

// 🎯 Verify Payment
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

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({
        success: false,
        message: "Invalid payment token signature verification.",
      });
    }

    const result = await finalizePayment({
      payment,
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
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.get("x-razorpay-signature");
    if (!signature || !req.rawBody) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay webhook signature.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.rawBody)
      .digest("hex");

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

    const shouldCredit =
      eventName === "payment.captured" ||
      eventName === "payment.authorized" ||
      eventName === "order.paid" ||
      ["captured", "authorized", "paid"].includes(paymentEntity.status);

    if (!shouldCredit) {
      if (eventName === "payment.failed") {
        payment.status = "failed";
        await payment.save();
      }
      return res.status(200).json({
        success: true,
        message: "Webhook processed without crediting the wallet.",
      });
    }

    await finalizePayment({
      payment,
      razorpayPaymentId: paymentEntity.id,
      razorpaySignature: signature,
    });

    res.status(200).json({
      success: true,
      message: "Payment credits synced via webhook.",
    });
  } catch (error) {
    console.error("Razorpay webhook failure:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
