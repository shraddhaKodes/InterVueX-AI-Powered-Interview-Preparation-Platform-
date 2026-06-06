import ErrorHandler from "../middlewares/error.js";

const ALLOWED_CATEGORIES = new Set([
  "technical",
  "behavioral",
  "system-design",
  "coding",
  "hr",
  "other",
]);

const ALLOWED_DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const EVALUATION_RUBRIC_KEYS = [
  "correctness",
  "communication",
  "depth",
  "tradeoffs",
  "codeQuality",
];

const stripCodeFences = (text) => {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const extractJsonObject = (text) => {
  const cleaned = stripCodeFences(text);
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new ErrorHandler("AI response did not contain valid JSON", 502);
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
};

const assertString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ErrorHandler(
      `Malformed AI response: ${fieldName} is required`,
      502,
    );
  }

  return value.trim();
};

const assertScore = (value, fieldName) => {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new ErrorHandler(
      `Malformed AI response: ${fieldName} must be an integer from 0 to 100`,
      502,
    );
  }

  return value;
};

const normalizeFeedback = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return [];
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsedArray = JSON.parse(trimmed);
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        }
      } catch (error) {
        // fall through and try line-based normalization
      }
    }

    const lines = trimmed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    return lines.length > 0 ? lines : [trimmed];
  }

  return value;
};

const assertFeedback = (value) => {
  const normalized = normalizeFeedback(value);

  if (
    !Array.isArray(normalized) ||
    normalized.length < 3 ||
    normalized.length > 5 ||
    !normalized.every((item) => typeof item === "string" && item.trim() !== "")
  ) {
    throw new ErrorHandler(
      "Malformed AI response: feedback array is required",
      502,
    );
  }

  return normalized.map((item) => item.trim());
};

const parseJsonObjectResponse = (rawResponse) => {
  if (typeof rawResponse !== "string" || rawResponse.trim() === "") {
    throw new ErrorHandler("AI response was empty", 502);
  }

  try {
    return JSON.parse(extractJsonObject(rawResponse));
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error;
    }

    throw new ErrorHandler("AI response JSON was malformed", 502);
  }
};

export const parseGeneratedQuestionsResponse = (
  rawResponse,
  expectedCount = 5,
) => {
  const parsed = parseJsonObjectResponse(rawResponse);

  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new ErrorHandler(
      "Malformed AI response: questions array is required",
      502,
    );
  }

  if (parsed.questions.length !== expectedCount) {
    throw new ErrorHandler(
      `Malformed AI response: expected ${expectedCount} questions`,
      502,
    );
  }

  return parsed.questions.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new ErrorHandler(
        `Malformed AI response: question ${index + 1} is invalid`,
        502,
      );
    }

    const question = assertString(
      item.question,
      `questions[${index}].question`,
    );
    const expectedAnswer = assertString(
      item.expectedAnswer,
      `questions[${index}].expectedAnswer`,
    );
    const category =
      typeof item.category === "string" ? item.category.trim() : "technical";
    const difficulty =
      typeof item.difficulty === "string" ? item.difficulty.trim() : "medium";

    if (!ALLOWED_CATEGORIES.has(category)) {
      throw new ErrorHandler(
        `Malformed AI response: invalid category at question ${index + 1}`,
        502,
      );
    }

    if (!ALLOWED_DIFFICULTIES.has(difficulty)) {
      throw new ErrorHandler(
        `Malformed AI response: invalid difficulty at question ${index + 1}`,
        502,
      );
    }

    return {
      question,
      category,
      expectedAnswer,
      difficulty,
    };
  });
};

export const parseAnswerEvaluationResponse = (rawResponse) => {
  console.log("parseAnswerEvaluationResponse rawResponse:", rawResponse);
  const parsed = parseJsonObjectResponse(rawResponse);
  console.log("parseAnswerEvaluationResponse parsed JSON:", parsed);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ErrorHandler(
      "Malformed AI response: evaluation object is required",
      502,
    );
  }

  if (
    !parsed.rubric ||
    typeof parsed.rubric !== "object" ||
    Array.isArray(parsed.rubric)
  ) {
    throw new ErrorHandler(
      "Malformed AI response: rubric object is required",
      502,
    );
  }

  const rubric = EVALUATION_RUBRIC_KEYS.reduce((accumulator, key) => {
    accumulator[key] = assertScore(parsed.rubric[key], `rubric.${key}`);
    return accumulator;
  }, {});

  const evaluation = {
    score: assertScore(parsed.score, "score"),
    feedback: assertFeedback(parsed.feedback),
    rubric,
  };

  console.log("parseAnswerEvaluationResponse evaluation object:", evaluation);

  return evaluation;
};
