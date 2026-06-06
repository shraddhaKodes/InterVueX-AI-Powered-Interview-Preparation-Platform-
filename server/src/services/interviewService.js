import { Interview } from "../models/InterviewSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { evaluateAnswer, generateQuestions } from "./aiService.js";
import { buildPaginationMeta, getPagination, getSort } from "./queryService.js";

const buildInterviewFilter = (userId, query) => {
  const filter = { user: userId };

  if (query.status) filter.status = query.status;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.interviewType) filter.interviewType = query.interviewType;

  return filter;
};

const getValidatedAnswerPayload = (payload) => {
  const questionIndex = Number(payload?.questionIndex);
  const answer =
    typeof payload?.answer === "string" ? payload.answer.trim() : "";

  if (!Number.isInteger(questionIndex) || questionIndex < 0) {
    throw new ErrorHandler("questionIndex must be a non-negative integer", 400);
  }

  if (!answer) {
    throw new ErrorHandler("Answer is required", 400);
  }

  if (answer.length > 10000) {
    throw new ErrorHandler("Answer must not exceed 10000 characters", 400);
  }

  return {
    questionIndex,
    answer,
  };
};

const calculateOverallScore = (answers = []) => {
  const evaluatedAnswers = answers.filter((answer) => {
    return answer.evaluatedAt && Number.isFinite(answer.score);
  });

  if (evaluatedAnswers.length === 0) {
    return 0;
  }

  const totalScore = evaluatedAnswers.reduce((total, answer) => {
    return total + answer.score;
  }, 0);

  return Math.round(totalScore / evaluatedAnswers.length);
};

const upsertInterviewAnswer = (interview, answerPayload) => {
  const existingAnswerIndex = interview.answers.findIndex((answer) => {
    return answer.questionIndex === answerPayload.questionIndex;
  });

  if (existingAnswerIndex >= 0) {
    interview.answers[existingAnswerIndex] = answerPayload;
    return existingAnswerIndex;
  }

  interview.answers.push(answerPayload);
  return interview.answers.length - 1;
};

export const createInterviewService = async (userId, payload) => {
  return await Interview.create({
    ...payload,
    user: userId,
  });
};

export const getUserInterviewsService = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildInterviewFilter(userId, query);
  const sort = getSort(query);

  const [interviews, total] = await Promise.all([
    Interview.find(filter).sort(sort).skip(skip).limit(limit),
    Interview.countDocuments(filter),
  ]);

  return {
    interviews,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getInterviewByIdService = async (userId, interviewId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new ErrorHandler("Interview not found", 404);
  }

  return interview;
};

export const updateInterviewService = async (userId, interviewId, payload) => {
  const interview = await Interview.findOneAndUpdate(
    {
      _id: interviewId,
      user: userId,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!interview) {
    throw new ErrorHandler("Interview not found", 404);
  }

  return interview;
};

export const deleteInterviewService = async (userId, interviewId) => {
  const interview = await Interview.findOneAndDelete({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new ErrorHandler("Interview not found", 404);
  }

  return interview;
};

export const generateInterviewQuestionsService = async (
  userId,
  interviewId,
) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new ErrorHandler("Interview not found", 404);
  }

  const { questions, metadata } = await generateQuestions(interview);

  interview.questions = questions;
  interview.aiMetadata = metadata;

  await interview.save();

  return interview;
};

export const submitInterviewAnswerService = async (
  userId,
  interviewId,
  payload,
) => {
  const { questionIndex, answer } = getValidatedAnswerPayload(payload);
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new ErrorHandler("Interview not found", 404);
  }

  const question = interview.questions[questionIndex];

  if (!question) {
    throw new ErrorHandler("Question index not found", 404);
  }

  const answerPayload = {
    questionIndex,
    question: question.question,
    answer,
    score: 0,
    feedback: [],
    rubric: {
      correctness: 0,
      communication: 0,
      depth: 0,
      tradeoffs: 0,
      codeQuality: 0,
    },
    answeredAt: new Date(),
    evaluatedAt: undefined,
  };

  const answerIndex = upsertInterviewAnswer(interview, answerPayload);
  interview.status =
    interview.status === "scheduled" ? "in-progress" : interview.status;

  await interview.save();

  const evaluation = await evaluateAnswer({
    interview,
    question,
    answer,
  });

  console.log("Evaluation object before save:", evaluation);

  interview.answers[answerIndex] = {
    ...answerPayload,
    score: evaluation.score,
    feedback: evaluation.feedback,
    rubric: evaluation.rubric,
    evaluatedAt: evaluation.metadata.evaluatedAt,
  };

  console.log(
    "Interview answer object after evaluation:",
    interview.answers[answerIndex],
  );
  interview.score = calculateOverallScore(interview.answers);

  await interview.save();

  return {
    interview,
    answer: interview.answers[answerIndex],
  };
};
