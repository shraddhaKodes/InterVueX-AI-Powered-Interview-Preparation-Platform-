import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  deleteResumeAnalysisService,
  getResumeAnalysesService,
  getResumeAnalysisByIdService,
  uploadResumeAnalysisService,
  analyzeResumeWithAIAndSave,
} from "../services/resumeAnalysisService.js";
import { uploadPdfToCloudinaryAndExtractText } from "../services/resumeAnalysisUploadService.js";

export const uploadResumeAnalysis = catchAsyncErrors(async (req, res) => {
  const resumeAnalysis = await uploadResumeAnalysisService(
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Resume analysis created successfully",
    resumeAnalysis,
  });
});

export const analyzeResume = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "resume file is required",
    });
  }
  console.log("Received file:", req.file.originalname, "size:", req.file.size);
  const { resumeUrl, resumeText } = await uploadPdfToCloudinaryAndExtractText(
    req.file,
  );

  const resumeAnalysis = await analyzeResumeWithAIAndSave(req.user.id, {
    resumeUrl,
    resumeText,
  });

  res.status(201).json({
    success: true,
    resumeAnalysis,
  });
});

export const getResumeAnalyses = catchAsyncErrors(async (req, res) => {
  const result = await getResumeAnalysesService(req.user.id, req.query);

  res.status(200).json({
    success: true,
    message: "Resume analyses fetched successfully",
    ...result,
  });
});

export const getResumeAnalysisById = catchAsyncErrors(async (req, res) => {
  const resumeAnalysis = await getResumeAnalysisByIdService(
    req.user.id,
    req.params.id,
  );

  res.status(200).json({
    success: true,
    message: "Resume analysis fetched successfully",
    resumeAnalysis,
  });
});

export const deleteResumeAnalysis = catchAsyncErrors(async (req, res) => {
  await deleteResumeAnalysisService(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Resume analysis deleted successfully",
  });
});
