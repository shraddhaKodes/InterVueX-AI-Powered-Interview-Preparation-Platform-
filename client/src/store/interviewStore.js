import { create } from "zustand";
import {
  createInterview,
  generateInterviewQuestions,
  getInterviewById,
  getMyInterviews,
  submitInterviewAnswer,
} from "../api/interviewApi.js";

const getApiMessage = (error, fallback) => {
  if (error?.response?.status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (!error?.response) {
    return "Network error. Please check your connection and try again.";
  }

  return error.response?.data?.message || error.message || fallback;
};

const getInterviewId = (interview) => interview?._id || interview?.id;

const normalizeInterview = (interview = {}) => ({
  ...interview,
  _id: getInterviewId(interview),
  questions: interview.questions || [],
  answers: interview.answers || [],
  techStack: interview.techStack || [],
});

const mergeAnswer = (interview, answer) => {
  if (!interview || !answer) {
    return interview;
  }

  const answers = [...(interview.answers || [])];
  const answerIndex = answers.findIndex((item) => item.questionIndex === answer.questionIndex);

  if (answerIndex >= 0) {
    answers[answerIndex] = answer;
  } else {
    answers.push(answer);
  }

  return {
    ...interview,
    answers,
  };
};

export const useInterviewStore = create((set, get) => ({
  interviews: [],
  currentInterview: null,
  pagination: null,
  loading: false,
  creating: false,
  generating: false,
  submittingIndex: null,
  error: null,

  clearError: () => set({ error: null }),

  loadMyInterviews: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const data = await getMyInterviews(params);
      const interviews = (data.interviews || []).map(normalizeInterview);

      set({
        interviews,
        pagination: data.pagination || null,
      });

      return interviews;
    } catch (error) {
      const message = getApiMessage(error, "Could not load interviews.");
      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ loading: false });
    }
  },

  loadInterview: async (interviewId) => {
    set({ loading: true, error: null });

    try {
      const data = await getInterviewById(interviewId);
      const interview = normalizeInterview(data.interview);

      set({ currentInterview: interview });
      return interview;
    } catch (error) {
      const message = getApiMessage(error, "Could not load this interview.");
      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ loading: false });
    }
  },

  createInterview: async (payload) => {
    set({ creating: true, error: null });

    try {
      const data = await createInterview(payload);
      const interview = normalizeInterview(data.interview);

      set({ currentInterview: interview });
      return interview;
    } catch (error) {
      const message = getApiMessage(error, "Could not create interview.");
      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ creating: false });
    }
  },

  generateQuestions: async (interviewId) => {
    set({ generating: true, error: null });

    try {
      const data = await generateInterviewQuestions(interviewId);
      const generated = normalizeInterview(data.interview);
      const current = get().currentInterview;
      const interview = current?._id === generated._id
        ? normalizeInterview({ ...current, ...generated })
        : generated;

      set({ currentInterview: interview });
      return interview;
    } catch (error) {
      const message = getApiMessage(error, "Could not generate interview questions.");
      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ generating: false });
    }
  },

  submitAnswer: async (interviewId, payload) => {
    set({ submittingIndex: payload.questionIndex, error: null });

    try {
      const data = await submitInterviewAnswer(interviewId, payload);
      const current = get().currentInterview;
      const merged = mergeAnswer(current, data.answer);
      const interview = normalizeInterview({
        ...merged,
        score: data.interview?.score ?? merged?.score ?? 0,
        status: data.interview?.status ?? merged?.status,
      });

      set({ currentInterview: interview });
      return data.answer;
    } catch (error) {
      const message = getApiMessage(error, "Could not evaluate this answer.");
      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ submittingIndex: null });
    }
  },
}));
