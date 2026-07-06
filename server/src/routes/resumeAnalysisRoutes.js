import express from "express";
import {
  deleteResumeAnalysis,
  getResumeAnalyses,
  getResumeAnalysisById,
  uploadResumeAnalysis,
  analyzeResume,
} from "../controllers/resumeAnalysisController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  validateObjectId,
  validatePagination,
  validateRequiredFields,
} from "../middlewares/validation.js";
import { handleResumeUpload } from "./resumeAnalysisMulter.js";

const router = express.Router();

router.use(isAuthenticated);

router
  .route("/")
  .post(handleResumeUpload, analyzeResume)
  .get(validatePagination, getResumeAnalyses);

// Keep legacy resumeUrl endpoint (if client already sends resumeUrl)
router
  .route("/url")
  .post(validateRequiredFields("resumeUrl"), uploadResumeAnalysis);

router
  .route("/:id")
  .get(validateObjectId(), getResumeAnalysisById)
  .delete(validateObjectId(), deleteResumeAnalysis);

export default router;
