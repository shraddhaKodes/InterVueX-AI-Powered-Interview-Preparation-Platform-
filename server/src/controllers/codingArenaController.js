import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  listProblemsService,
  getProblemByIdService,
  runCodeService,
  submitSolutionService,
  getUserSubmissionsService,
  getSubmissionByIdService,
} from "../services/codingArenaService.js";

export const listProblems = catchAsyncErrors(async (req, res) => {
  const result = await listProblemsService(req.query, req.user);
  res.status(200).json({
    success: true,
    message: "Problems fetched successfully",
    data: result,
  });
});

export const getProblemById = catchAsyncErrors(async (req, res) => {
  const problem = await getProblemByIdService(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: "Problem fetched successfully",
    data: { problem },
  });
});

export const runCode = catchAsyncErrors(async (req, res) => {
  const { sourceCode, language, input, customInput } = req.body;
  const execution = await runCodeService({
    sourceCode,
    language,
    input: input ?? customInput ?? "",
  });
  res.status(200).json({
    success: true,
    message: "Code executed successfully",
    data: { execution },
  });
});

export const submitSolution = catchAsyncErrors(async (req, res) => {
  const { problemId, sourceCode, language, parallel } = req.body;
  const userId = req.user?.id;
  const result = await submitSolutionService({
    userId,
    problemId,
    sourceCode,
    language,
    parallel,
  });
  res.status(200).json({
    success: true,
    message: "Solution submitted successfully",
    data: result,
  });
});

export const getUserSubmissions = catchAsyncErrors(async (req, res) => {
  const result = await getUserSubmissionsService(req.user.id, req.query);
  res.status(200).json({
    success: true,
    message: "Coding submissions fetched successfully",
    data: result,
  });
});

export const getSubmissionById = catchAsyncErrors(async (req, res) => {
  const submission = await getSubmissionByIdService(req.user.id, req.params.id);
  res.status(200).json({
    success: true,
    message: "Coding submission fetched successfully",
    data: { submission },
  });
});
