import { MockInterview } from "../models/MockInterviewSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";

export const createMockInterviewService = async (userId, payload) => {
  return await MockInterview.create({
    ...payload,
    user: userId,
  });
};

export const getMockInterviewsService = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };

  if (query.completed === "true") filter.completedAt = { $ne: null };
  if (query.completed === "false") filter.completedAt = { $exists: false };

  const [mockInterviews, total] = await Promise.all([
    MockInterview.find(filter).sort(getSort(query)).skip(skip).limit(limit),
    MockInterview.countDocuments(filter),
  ]);

  return {
    mockInterviews,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const submitMockInterviewService = async (userId, mockInterviewId, payload) => {
  const questions = payload.questions || [];
  const completedQuestions =
    payload.completedQuestions ?? questions.filter((question) => question.isCompleted).length;

  const mockInterview = await MockInterview.findOneAndUpdate(
    {
      _id: mockInterviewId,
      user: userId,
    },
    {
      ...payload,
      questions,
      completedQuestions,
      completedAt: payload.completedAt || new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!mockInterview) {
    throw new ErrorHandler("Mock interview not found", 404);
  }

  return mockInterview;
};

export const deleteMockInterviewService = async (userId, mockInterviewId) => {
  const mockInterview = await MockInterview.findOneAndDelete({
    _id: mockInterviewId,
    user: userId,
  });

  if (!mockInterview) {
    throw new ErrorHandler("Mock interview not found", 404);
  }

  return mockInterview;
};
