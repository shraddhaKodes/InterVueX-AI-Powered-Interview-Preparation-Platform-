import ErrorHandler from "../middlewares/error.js";
import { generateResumeAnalysisRaw } from "./aiService.js";
import { resumeAnalysisPrompt } from "../prompts/resumeAnalysisPrompt.js";

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const assertStringArray = (value, fieldName) => {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw new ErrorHandler(
      `Malformed AI response: ${fieldName} must be an array of strings`,
      502,
    );
  }
  return value;
};

export const parseResumeAnalysisResponse = (aiResponse) => {
  const parsed =
    typeof aiResponse === "string" ? JSON.parse(aiResponse) : aiResponse;

  if (!isPlainObject(parsed)) {
    throw new ErrorHandler("Malformed AI response", 502);
  }

  const requiredTopLevel = [
    "ATSScore",
    "extractedSkills",
    "missingSkills",
    "suggestedImprovements",
    "feedback",
  ];

  for (const key of requiredTopLevel) {
    if (parsed[key] === undefined) {
      throw new ErrorHandler("Malformed AI response", 502);
    }
  }

  const ATSScore = parsed.ATSScore;
  if (!Number.isInteger(ATSScore) || ATSScore < 0 || ATSScore > 100) {
    throw new ErrorHandler("Malformed AI response", 502);
  }

  const extractedSkills = assertStringArray(
    parsed.extractedSkills,
    "extractedSkills",
  );
  const missingSkills = assertStringArray(
    parsed.missingSkills,
    "missingSkills",
  );
  const suggestedImprovements = assertStringArray(
    parsed.suggestedImprovements,
    "suggestedImprovements",
  );

  const feedback = parsed.feedback;
  if (!isPlainObject(feedback)) {
    throw new ErrorHandler("Malformed AI response", 502);
  }

  if (typeof feedback.summary !== "string" || feedback.summary.trim() === "") {
    throw new ErrorHandler("Malformed AI response", 502);
  }

  if (
    !Array.isArray(feedback.sections) ||
    !feedback.sections.every((s) => typeof s === "string")
  ) {
    throw new ErrorHandler("Malformed AI response", 502);
  }

  if (
    !Array.isArray(feedback.keywordMatches) ||
    !feedback.keywordMatches.every((k) => typeof k === "string")
  ) {
    throw new ErrorHandler("Malformed AI response", 502);
  }

  return {
    ATSScore,
    extractedSkills,
    missingSkills,
    suggestedImprovements,
    feedback: {
      summary: feedback.summary,
      sections: feedback.sections,
      keywordMatches: feedback.keywordMatches,
    },
  };
};

export const analyzeResumeWithAI = async (resumeText) => {
  const prompt = resumeAnalysisPrompt(resumeText);

  const attempt = async () => {
    const raw = await generateResumeAnalysisRaw(prompt, "analyze resume");
    return parseResumeAnalysisResponse(raw);
  };

  try {
    return await attempt();
  } catch (err) {
    // Retry once if invalid JSON/invalid response
    try {
      return await attempt();
    } catch (err2) {
      // Requirement: if still invalid JSON after retry, throw "Malformed AI response"
      if (err2 instanceof Error) {
        throw new ErrorHandler("Malformed AI response", 502);
      }

      throw new ErrorHandler("Malformed AI response", 502);
    }
  }
};
