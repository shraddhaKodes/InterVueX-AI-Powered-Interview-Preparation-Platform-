import express from "express";
import { isAuthenticated, restrictTo } from "../middlewares/auth.js";
import {
  getAdminSubmissions,
  getAdminSubmissionById,
} from "../controllers/adminCodingSubmissionsController.js";
import {
  validateBodyObjectId,
  validatePagination,
} from "../middlewares/validation.js";

const router = express.Router();

router.get(
  "/submissions",
  isAuthenticated,
  restrictTo("admin"),
  validatePagination,
  getAdminSubmissions,
);

router.get(
  "/submissions/:id",
  isAuthenticated,
  restrictTo("admin"),
  validateBodyObjectId("id"),
  getAdminSubmissionById,
);

export default router;
