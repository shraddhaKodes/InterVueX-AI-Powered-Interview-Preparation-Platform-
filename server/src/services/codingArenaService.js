import { Problem } from "../models/ProblemSchema.js";
import { CodingSubmission } from "../models/CodingSubmissionSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { executeCode } from "./onlineCompilerService.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";

const isAdmin = (user) => user?.role === "admin";

export const serializeProblem = (problem, { includeHidden = false } = {}) => {
  if (!problem) return null;

  const data = problem.toObject ? problem.toObject() : { ...problem };

  if (!includeHidden) {
    delete data.hiddenTestCases;
  }

  return data;
};

const getAllTestCases = (problem) => [
  ...(problem.visibleTestCases || []),
  ...(problem.hiddenTestCases || []),
];

const normalizeTestOutput = (value = "") =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .trim();

const deriveExecutionVerdict = ({ error = "", status = {} }) => {
  const normalizedError = String(error || "").toLowerCase();

  if (
    status.timedOut ||
    /time limit/.test(normalizedError) ||
    /timed out/.test(normalizedError)
  ) {
    return "time-limit-exceeded";
  }

  if (normalizedError) {
    if (/compile|syntax|parse/.test(normalizedError)) {
      return "compilation-error";
    }

    return "runtime-error";
  }

  return "accepted";
};

const executeTestCase = async ({ sourceCode, language, testCase, index }) => {
  try {
    const result = await executeCode({
      sourceCode,
      language,
      input: testCase.input,
    });

    const actualOutput = normalizeTestOutput(result.output);
    const expectedOutput = normalizeTestOutput(testCase.output);
    const executionVerdict = deriveExecutionVerdict(result);
    const passed =
      executionVerdict === "accepted" && actualOutput === expectedOutput;

    return {
      index,
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      status:
        executionVerdict === "accepted" && !passed
          ? "wrong-answer"
          : executionVerdict,
      passed,
    };
  } catch (err) {
    return {
      index,
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: "",
      error: err.message || "Execution failed",
      executionTime: 0,
      memoryUsage: 0,
      status: "runtime-error",
      passed: false,
    };
  }
};

const deriveSubmissionVerdict = (logs) => {
  if (logs.some((log) => log.status === "compilation-error")) {
    return "compilation-error";
  }

  if (logs.some((log) => log.status === "time-limit-exceeded")) {
    return "time-limit-exceeded";
  }

  if (logs.some((log) => log.status === "runtime-error")) {
    return "runtime-error";
  }

  if (logs.some((log) => !log.passed)) {
    return "wrong-answer";
  }

  return "accepted";
};

export const listProblemsService = async (query, user) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [problems, total] = await Promise.all([
    (isAdmin(user)
      ? Problem.find({}).select("+hiddenTestCases")
      : Problem.find({})
    )
      .skip(skip)
      .limit(limit),
    Problem.countDocuments({}),
  ]);

  return {
    problems: problems.map((problem) =>
      serializeProblem(problem, { includeHidden: isAdmin(user) }),
    ),
    pagination: { page, limit, total },
  };
};

export const getProblemByIdService = async (id, user) => {
  const query = Problem.findById(id);
  if (isAdmin(user)) query.select("+hiddenTestCases");
  const problem = await query;

  if (!problem) throw new ErrorHandler("Problem not found", 404);
  return serializeProblem(problem, { includeHidden: isAdmin(user) });
};

export const runCodeService = async ({ sourceCode, language, input = "" }) => {
  const execution = await executeCode({ sourceCode, language, input });
  return {
    output: execution.output,
    error: execution.error,
    executionTime: execution.executionTime,
    memoryUsage: execution.memoryUsage,
  };
};

export const submitSolutionService = async ({
  userId,
  problemId,
  sourceCode,
  language,
}) => {
  if (!userId) {
    throw new ErrorHandler("Authentication required", 401);
  }

  const problem = await Problem.findById(problemId).select(
    "+hiddenTestCases"
  );

  if (!problem) {
    throw new ErrorHandler("Problem not found", 404);
  }

  const testCases = getAllTestCases(problem);

  if (!testCases.length) {
    throw new ErrorHandler("Problem has no test cases", 400);
  }

  const testcaseResults = [];

  for (let index = 0; index < testCases.length; index++) {
    const result = await executeTestCase({
      sourceCode,
      language,
      testCase: testCases[index],
      index,
    });

    testcaseResults.push(result);
  }

  const passedTestCases = testcaseResults.filter(
    (result) => result.passed
  ).length;

  const totalTestCases = testcaseResults.length;

  const verdict = deriveSubmissionVerdict(testcaseResults);

  const executionTime = testcaseResults.reduce(
    (sum, result) => sum + (result.executionTime || 0),
    0
  );

  const memoryUsage = testcaseResults.reduce(
    (max, result) => Math.max(max, result.memoryUsage || 0),
    0
  );

  // Score Calculation
  const score =
    verdict === "accepted"
      ? 100
      : Math.round((passedTestCases / totalTestCases) * 100);

  const submission = await CodingSubmission.create({
    user: userId,
    problem: problem._id,
    problemTitle: problem.title,

    language,
    sourceCode,

    verdict,
    score,

    passedTestCases,
    totalTestCases,

    executionTime,
    memoryUsage,

    testcaseResults,

    submittedAt: new Date(),
  });

  return {
    submission,

    result: {
      verdict,
      score,

      passedTestCases,
      totalTestCases,

      executionTime,
      memoryUsage,

      testcaseResults,
    },
  };
};
export const getUserSubmissionsService = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };

  if (query.verdict) filter.verdict = query.verdict;
  if (query.language) filter.language = query.language;
  if (query.problemTitle)
    filter.problemTitle = new RegExp(query.problemTitle, "i");

  const [submissions, total] = await Promise.all([
    CodingSubmission.find(filter).sort(getSort(query)).skip(skip).limit(limit),
    CodingSubmission.countDocuments(filter),
  ]);

  return {
    submissions,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getSubmissionByIdService = async (userId, submissionId) => {
  const submission = await CodingSubmission.findOne({
    _id: submissionId,
    user: userId,
  });

  if (!submission) {
    throw new ErrorHandler("Coding submission not found", 404);
  }

  return submission;
};
