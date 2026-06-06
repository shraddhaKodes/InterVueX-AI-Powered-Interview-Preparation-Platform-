import { GoogleGenerativeAI } from "@google/generative-ai";
import ErrorHandler from "../middlewares/error.js";
import { buildAnswerEvaluationPrompt } from "../prompts/evaluation.prompts.js";
import { buildTechnicalInterviewQuestionsPrompt } from "../prompts/technicalInterview.prompts.js";
import {
  parseAnswerEvaluationResponse,
  parseGeneratedQuestionsResponse,
} from "../utils/aiResponseParser.js";

const GEMINI_PROVIDER = "gemini";
const QUESTION_COUNT = 5;
const AI_RETRY_ATTEMPTS = 2;
const AI_RETRY_DELAY_MS = 700;
const DEFAULT_GEMINI_MODEL = "gemini-flash-latest";

const getGeminiModelName = () => {
  return process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
};

const getGeminiErrorMessage = (
  error,
  action = "generate interview questions",
) => {
  if (error?.status === 429) {
    return "Gemini quota exceeded. Please check your Google AI Studio billing, quota, or retry after the suggested delay.";
  }

  if (error?.status === 400) {
    return "Gemini rejected the request. Please verify the prompt payload and model configuration.";
  }

  if (error?.status === 401 || error?.status === 403) {
    return "Gemini authentication failed. Please verify GEMINI_API_KEY permissions and API access.";
  }

  if (error?.status >= 500) {
    return "Gemini service is temporarily unavailable. Please try again later.";
  }

  return `Failed to ${action}`;
};

const getHttpStatusCode = (error) => {
  if (
    Number.isInteger(error?.status) &&
    error.status >= 400 &&
    error.status < 600
  ) {
    return error.status;
  }

  return 502;
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const shouldRetryAiFailure = (error) => {
  if (error instanceof ErrorHandler) {
    return error.statusCode === 502;
  }

  return [429, 500, 502, 503, 504].includes(error?.status);
};

const runWithRetry = async (operation, action) => {
  let lastError;

  for (let attempt = 0; attempt <= AI_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === AI_RETRY_ATTEMPTS || !shouldRetryAiFailure(error)) {
        throw error;
      }

      await sleep(AI_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw new ErrorHandler(
    getGeminiErrorMessage(lastError, action),
    getHttpStatusCode(lastError),
  );
};

const getGeminiModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new ErrorHandler("GEMINI_API_KEY is not configured", 500);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = getGeminiModelName();

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });
};

export const generateQuestions = async (interview) => {
  const prompt = buildTechnicalInterviewQuestionsPrompt({
    role: interview.role,
    company: interview.company,
    difficulty: interview.difficulty,
    techStack: interview.techStack,
    interviewType: interview.interviewType,
    questionCount: QUESTION_COUNT,
  });

  try {
    const model = getGeminiModel();
    const questions = await runWithRetry(async () => {
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();

      return parseGeneratedQuestionsResponse(rawResponse, QUESTION_COUNT);
    }, "generate interview questions");

    return {
      questions,
      metadata: {
        provider: GEMINI_PROVIDER,
        model: getGeminiModelName(),
        generatedAt: new Date(),
      },
    };
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }

    console.error("Gemini question generation failed:", {
      status: error?.status,
      statusText: error?.statusText,
      message: error?.message,
    });

    throw new ErrorHandler(
      getGeminiErrorMessage(error, "generate interview questions"),
      getHttpStatusCode(error),
    );
  }
};

export const evaluateAnswer = async ({ interview, question, answer }) => {
  const prompt = buildAnswerEvaluationPrompt({
    role: interview.role,
    company: interview.company,
    difficulty: interview.difficulty,
    techStack: interview.techStack,
    interviewType: interview.interviewType,
    question: question.question,
    expectedAnswer: question.expectedAnswer,
    answer,
  });

  try {
    const model = getGeminiModel();
    const evaluation = await runWithRetry(async () => {
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();
      console.log("Raw Gemini evaluation response:", rawResponse);
      const evaluation = parseAnswerEvaluationResponse(rawResponse);
      console.log("Parsed evaluation result:", evaluation);
      return evaluation;
    }, "evaluate interview answer");

    return {
      ...evaluation,
      metadata: {
        provider: GEMINI_PROVIDER,
        model: getGeminiModelName(),
        evaluatedAt: new Date(),
      },
    };
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }

    console.error("Gemini answer evaluation failed:", {
      status: error?.status,
      statusText: error?.statusText,
      message: error?.message,
    });

    throw new ErrorHandler(
      getGeminiErrorMessage(error, "evaluate interview answer"),
      getHttpStatusCode(error),
    );
  }
};

export const generateResumeAnalysisRaw = async (prompt, action) => {
  try {
    const model = getGeminiModel();
    const rawResponse = await runWithRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }, action || "analyze resume");

    return rawResponse;
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }

    console.error("Gemini resume analysis failed:", {
      status: error?.status,
      statusText: error?.statusText,
      message: error?.message,
    });

    throw new ErrorHandler(
      getGeminiErrorMessage(error, action || "analyze resume"),
      getHttpStatusCode(error),
    );
  }
};
