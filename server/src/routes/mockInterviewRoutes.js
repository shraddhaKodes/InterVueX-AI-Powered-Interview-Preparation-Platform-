import express from "express";
import {
  createMockInterview,
  deleteMockInterview,
  getMockInterviews,
  submitMockInterview,
} from "../controllers/mockInterviewController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  validateObjectId,
  validatePagination,
  validateRequiredFields,
} from "../middlewares/validation.js";

const router = express.Router();

router.use(isAuthenticated);

router
  .route("/")
  .post(validateRequiredFields("title"), createMockInterview)
  .get(validatePagination, getMockInterviews);

router
  .route("/:id/submit")
  .post(validateObjectId(), submitMockInterview)
  .put(validateObjectId(), submitMockInterview);

router
  .route("/:id")
  .delete(validateObjectId(), deleteMockInterview);

export default router;
