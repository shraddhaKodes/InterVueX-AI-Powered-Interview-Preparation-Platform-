import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {
  createInterviewService,
  deleteInterviewService,
  generateInterviewQuestionsService,
  getInterviewByIdService,
  getUserInterviewsService,
  submitInterviewAnswerService,
  updateInterviewService,
} from "../services/interviewService.js";

export const createInterview = catchAsyncErrors(async (req, res) => {
  const interview = await createInterviewService(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Interview created successfully",
    interview,
  });
});

export const getUserInterviews = catchAsyncErrors(async (req, res) => {
  const result = await getUserInterviewsService(req.user.id, req.query);

  res.status(200).json({
    success: true,
    message: "Interviews fetched successfully",
    ...result,
  });
});

export const getInterviewById = catchAsyncErrors(async (req, res) => {
  const interview = await getInterviewByIdService(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Interview fetched successfully",
    interview,
  });
});

export const updateInterview = catchAsyncErrors(async (req, res) => {
  const interview = await updateInterviewService(req.user.id, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Interview updated successfully",
    interview,
  });
});

export const deleteInterview = catchAsyncErrors(async (req, res) => {
  await deleteInterviewService(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully",
  });
});

export const generateInterviewQuestions = catchAsyncErrors(async (req, res) => {
  const interview = await generateInterviewQuestionsService(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Interview questions generated successfully",
    interview: {
      id: interview._id,
      role: interview.role,
      company: interview.company,
      difficulty: interview.difficulty,
      techStack: interview.techStack,
      interviewType: interview.interviewType,
      questions: interview.questions,
      aiMetadata: interview.aiMetadata,
    },
  });
});

export const submitInterviewAnswer = catchAsyncErrors(async (req, res) => {
  const result = await submitInterviewAnswerService(req.user.id, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Interview answer evaluated successfully",
    answer: result.answer,
    interview: {
      id: result.interview._id,
      score: result.interview.score,
      status: result.interview.status,
    },
  });
});
