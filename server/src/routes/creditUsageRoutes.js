import express from "express";
import {
  consumeCredits,
  getCreditHistory,
} from "../controllers/creditUsageController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  validatePagination,
  validateRequiredFields,
} from "../middlewares/validation.js";

const router = express.Router();

router.use(isAuthenticated);

/**
 * @route POST /api/credit-usage/consume
 * @desc Consume credits for a platform feature
 * @access Private
 */
router.post("/consume", validateRequiredFields("featureUsed", "creditsConsumed"), consumeCredits);

/**
 * @route GET /api/credit-usage/history
 * @desc Get paginated credit usage history
 * @access Private
 */
router.get("/history", validatePagination, getCreditHistory);

router
  .route("/")
  .post(validateRequiredFields("featureUsed", "creditsConsumed"), consumeCredits)
  .get(validatePagination, getCreditHistory);

export default router;
