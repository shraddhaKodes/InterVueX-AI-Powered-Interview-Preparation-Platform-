import express from "express";
import {
  createInterview,
  deleteInterview,
  generateInterviewQuestions,
  getInterviewById,
  getUserInterviews,
  submitInterviewAnswer,
  updateInterview,
} from "../controllers/interviewController.js";
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
  .post(validateRequiredFields("role"), createInterview)
  .get(validatePagination, getUserInterviews);

router
  .route("/create")
  .post(validateRequiredFields("role"), createInterview);

router
  .route("/my-interviews")
  .get(validatePagination, getUserInterviews);

router
  .route("/:id/generate-questions")
  .post(validateObjectId(), generateInterviewQuestions);

router
  .route("/:id/answers")
  .post(validateObjectId(), submitInterviewAnswer);

router
  .route("/:id")
  .get(validateObjectId(), getInterviewById)
  .put(validateObjectId(), updateInterview)
  .delete(validateObjectId(), deleteInterview);

export default router;
