import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  createMockInterviewService,
  deleteMockInterviewService,
  getMockInterviewsService,
  submitMockInterviewService,
} from "../services/mockInterviewService.js";

export const createMockInterview = catchAsyncErrors(async (req, res) => {
  const mockInterview = await createMockInterviewService(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Mock interview created successfully",
    mockInterview,
  });
});

export const getMockInterviews = catchAsyncErrors(async (req, res) => {
  const result = await getMockInterviewsService(req.user.id, req.query);

  res.status(200).json({
    success: true,
    message: "Mock interviews fetched successfully",
    ...result,
  });
});

export const submitMockInterview = catchAsyncErrors(async (req, res) => {
  const mockInterview = await submitMockInterviewService(
    req.user.id,
    req.params.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Mock interview submitted successfully",
    mockInterview,
  });
});

export const deleteMockInterview = catchAsyncErrors(async (req, res) => {
  await deleteMockInterviewService(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Mock interview deleted successfully",
  });
});
