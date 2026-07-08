import { ResumeAnalysis } from "../models/ResumeAnalysisSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";
import { analyzeResumeWithAI } from "./resumeAnalysisAI.js";

export const analyzeResumeWithAIAndSave = async (
  userId,
  { resumeUrl, resumeText },
) => {
  if (!resumeUrl || typeof resumeUrl !== "string") {
    throw new ErrorHandler("Malformed request: resumeUrl is required", 400);
  }

  if (
    !resumeText ||
    typeof resumeText !== "string" ||
    resumeText.trim() === ""
  ) {
    throw new ErrorHandler("Malformed request: resumeText is required", 400);
  }

  const resumeAnalysis = await analyzeResumeWithAI(resumeText);

  return await ResumeAnalysis.create({
    user: userId,
    resumeUrl,
    extractedSkills: resumeAnalysis.extractedSkills,
    missingSkills: resumeAnalysis.missingSkills,
    ATSScore: resumeAnalysis.ATSScore,
    feedback: resumeAnalysis.feedback,
    suggestedImprovements: resumeAnalysis.suggestedImprovements,
  });
};

export const getResumeAnalysesService = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };

  if (query.minATSScore) {
    filter.ATSScore = { $gte: Number(query.minATSScore) };
  }

  const [resumeAnalyses, total] = await Promise.all([
    ResumeAnalysis.find(filter).sort(getSort(query)).skip(skip).limit(limit),
    ResumeAnalysis.countDocuments(filter),
  ]);

  return {
    resumeAnalyses,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getResumeAnalysisByIdService = async (userId, analysisId) => {
  const resumeAnalysis = await ResumeAnalysis.findOne({
    _id: analysisId,
    user: userId,
  });

  if (!resumeAnalysis) {
    throw new ErrorHandler("Resume analysis not found", 404);
  }

  return resumeAnalysis;
};

export const deleteResumeAnalysisService = async (userId, analysisId) => {
  const resumeAnalysis = await ResumeAnalysis.findOneAndDelete({
    _id: analysisId,
    user: userId,
  });

  if (!resumeAnalysis) {
    throw new ErrorHandler("Resume analysis not found", 404);
  }

  return resumeAnalysis;
};
