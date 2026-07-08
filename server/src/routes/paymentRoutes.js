import express from "express";
import {
  createOrder,
  verifyPayment,
  handleRazorpayWebhook,
  getPaymentHistory,
} from "../controllers/paymentController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/webhook", handleRazorpayWebhook);

router.use(isAuthenticated);

// Create Razorpay order
router.post("/create-order", createOrder);

// Verify Razorpay payment
router.post("/verify-payment", verifyPayment);

// Payment history
router.get("/history", getPaymentHistory);

export default router;
