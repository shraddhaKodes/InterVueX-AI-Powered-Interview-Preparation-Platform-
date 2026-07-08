import express from "express";
import {
  deleteResumeAnalysis,
  getResumeAnalyses,
  getResumeAnalysisById,
  analyzeResume,
} from "../controllers/resumeAnalysisController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  validateObjectId,
  validatePagination,
} from "../middlewares/validation.js";
import { handleResumeUpload } from "./resumeAnalysisMulter.js";

const router = express.Router();

router.use(isAuthenticated);

router
  .route("/")
  .post(handleResumeUpload, analyzeResume)
  .get(validatePagination, getResumeAnalyses);

router
  .route("/:id")
  .get(validateObjectId(), getResumeAnalysisById)
  .delete(validateObjectId(), deleteResumeAnalysis);

export default router;
