import express from "express";
import { getAdminPaymentHistory } from "../controllers/adminPaymentController.js";
import { isAuthenticated, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/admin/history",
  isAuthenticated,
  restrictTo("admin"),
  getAdminPaymentHistory,
);

export default router;
