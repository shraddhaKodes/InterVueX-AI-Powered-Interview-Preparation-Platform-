import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  deleteResumeAnalysisService,
  getResumeAnalysesService,
  getResumeAnalysisByIdService,
  analyzeResumeWithAIAndSave,
} from "../services/resumeAnalysisService.js";
import { uploadPdfToCloudinaryAndExtractText } from "../services/resumeAnalysisUploadService.js";
import {
  consumeCreditsService,
  ensureSufficientCreditsService,
} from "../services/creditUsageService.js";
import { FEATURE_CREDITS } from "../config/featureCredits.js";

export const analyzeResume = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "resume file is required",
    });
  }

  const creditsToConsume = FEATURE_CREDITS["Resume Upload + Analysis"];
  await ensureSufficientCreditsService(req.user.id, creditsToConsume);

  console.log("Received file:", req.file.originalname, "size:", req.file.size);
  const { resumeUrl, resumeText } = await uploadPdfToCloudinaryAndExtractText(
    req.file,
  );

  const resumeAnalysis = await analyzeResumeWithAIAndSave(req.user.id, {
    resumeUrl,
    resumeText,
  });

  try {
    await consumeCreditsService(req.user.id, {
      featureUsed: "resume-analysis",
      creditsConsumed: creditsToConsume,
    });
  } catch (error) {
    if (resumeAnalysis?._id) {
      try {
        await deleteResumeAnalysisService(req.user.id, resumeAnalysis._id);
      } catch (cleanupError) {
        console.error("Failed to remove unpaid resume analysis:", cleanupError);
      }
    }

    throw error;
  }

  // Socket.IO notification
  const io = globalThis.__io;
  if (io) {
    io.to(String(req.user.id)).emit("notifications:new", {
      id: String(resumeAnalysis?._id || Date.now()),
      title: "Resume analysis finished",
      body: resumeAnalysis?.ATSScore
        ? `ATS Score: ${resumeAnalysis.ATSScore}`
        : "Your resume analysis is ready.",
      type: "resume-analysis",
      read: false,
      createdAt: new Date().toISOString(),
      href: "/dashboard/resume-analyzer",
    });
  }

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
