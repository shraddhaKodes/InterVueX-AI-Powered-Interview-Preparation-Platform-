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

    // Wipe past frozen or uncompleted pending items so this user has a clean slate
    await Payment.deleteMany({
      user: req.user.id,
      status: "pending",
    });

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

    if (payment.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment signature already verified previously.",
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

    payment.paymentId = razorpay_payment_id;
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "completed";
    payment.transactionDate = new Date();
    await payment.save();

    const updatedUser = await User.findByIdAndUpdate(
      payment.user,
      { $inc: { credits: payment.creditsPurchased } },
      { new: true },
    );

    // Socket.IO: emit credits update to this user
    const io = expressApp?.get?.("io") || globalThis.__io;
    if (io && updatedUser?._id) {
      io.to(String(updatedUser._id)).emit("credits:updated", {
        credits: updatedUser.credits,
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction verified successfully. Credits deposited.",
    });
  } catch (error) {
    console.error(error);
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
