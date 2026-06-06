import express from "express";
import {
  createPayment,
  getPaymentHistory,
  verifyPayment,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  validateBodyObjectId,
  validateObjectId,
  validatePagination,
  validateRequiredFields,
} from "../middlewares/validation.js";

const router = express.Router();

router.use(isAuthenticated);

/**
 * @route POST /api/payments/create
 * @desc Create a payment record for authenticated user
 * @access Private
 */
router.post("/create", validateRequiredFields("paymentId", "amount"), createPayment);

/**
 * @route POST /api/payments/verify
 * @desc Verify a payment record by MongoDB id from request body
 * @access Private
 */
router.post("/verify", validateRequiredFields("id"), validateBodyObjectId("id"), verifyPayment);

/**
 * @route GET /api/payments/history
 * @desc Get paginated payment history for authenticated user
 * @access Private
 */
router.get("/history", validatePagination, getPaymentHistory);

router
  .route("/")
  .post(validateRequiredFields("paymentId", "amount"), createPayment)
  .get(validatePagination, getPaymentHistory);

router
  .route("/:id/verify")
  .post(validateObjectId(), verifyPayment)
  .put(validateObjectId(), verifyPayment);

export default router;
