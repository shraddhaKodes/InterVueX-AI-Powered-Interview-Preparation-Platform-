import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

import { ThemeContext } from "../../context/ThemeContext.jsx";

import InterviewProgress from "../../components/interviews/InterviewProgress.jsx";
import InterviewTimer from "../../components/interviews/InterviewTimer.jsx";
import LoadingInterviewSkeleton from "../../components/interviews/LoadingInterviewSkeleton.jsx";
import QuestionCard from "../../components/interviews/QuestionCard.jsx";
import QuestionNavigator from "../../components/interviews/QuestionNavigator.jsx";
import { useInterviewStore } from "../../store/interviewStore.js";
import { consumeCredits } from "../../api/creditUsageApi.js";

const buildDrafts = (interview) => {
  return (interview?.answers || []).reduce((accumulator, answer) => {
    accumulator[answer.questionIndex] = answer.answer || "";
    return accumulator;
  }, {});
};

const typeLabels = {
  ai: "AI session",
  technical: "Technical",
  "system-design": "System design",
  behavioral: "Behavioral",
  hr: "HR",
  mock: "Mock",
};

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentInterview,
    loading,
    generating,
    submittingIndex,
    error,
    loadInterview,
    generateQuestions,
    submitAnswer,
  } = useInterviewStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drafts, setDrafts] = useState({});
  const { darkMode } = useContext(ThemeContext);
  useEffect(() => {
    loadInterview(id)
      .then((interview) => setDrafts(buildDrafts(interview)))
      .catch(() => {});
  }, [id, loadInterview]);

  const questions = currentInterview?.questions || [];
  const answers = currentInterview?.answers || [];
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.find(
    (answer) => answer.questionIndex === currentIndex,
  );
  const answeredCount = answers.filter((answer) => answer.evaluatedAt).length;
  const sessionType =
    typeLabels[currentInterview?.interviewType] || "AI session";

  const handleGenerate = async () => {
    try {
      // Credit monetization: charge for AI question generation
      await consumeCredits({
        featureUsed: "ai-interview",
        creditsConsumed: 1,
      });

      const interview = await generateQuestions(id);
      setDrafts(buildDrafts(interview));
    } catch {
      // Store-level error is rendered below.
    }
  };

  const handleSubmit = async () => {
    try {
      await submitAnswer(id, {
        questionIndex: currentIndex,
        answer: drafts[currentIndex] || "",
      });
    } catch {
      // Store-level error is rendered below.
    }
  };

  if (loading && !currentInterview) {
    return (
      <div className="space-y-6">
        <LoadingInterviewSkeleton rows={3} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Interview session
          </p>
          <h2
            className={`text-3xl font-semibold transition-all duration-500 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {currentInterview?.role || "AI Interview"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {currentInterview?.company || "Company not specified"} •{" "}
            {sessionType} • {currentInterview?.difficulty || "medium"}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <InterviewTimer startedAt={currentInterview?.createdAt} />
          <Link
            to={`/dashboard/ai-interviews/${id}/result`}
            className={`inline-flex items-center gap-2 rounded-3xl px-5 py-3 text-sm font-semibold transition-all duration-500 ${
              darkMode
                ? "border border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Result
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="dashboard-panel text-center">
          <h3
            className={`text-2xl font-semibold transition-all duration-500 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            No generated questions yet
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Generate live AI questions for this interview before starting the
            session.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={18} />
            {generating ? "Generating questions..." : "Generate questions"}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-5">
            <div className="dashboard-panel sticky top-24">
              <p
                className={`text-xs uppercase tracking-[0.24em] ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Session overview
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4">
                  <p
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-500 ${
                      darkMode
                        ? "border border-slate-700 bg-slate-900 text-slate-200"
                        : "border border-slate-200 bg-slate-100 text-slate-700"
                    }`}
                  >
                    Interview type
                  </p>
                  <p
                    className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-500 ${
                      darkMode
                        ? "border border-cyan-500/20 bg-cyan-500/15 text-cyan-300"
                        : "border border-cyan-200 bg-cyan-100 text-cyan-700"
                    }`}
                  >
                    {sessionType}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4">
                  <p
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-500 ${
                      darkMode
                        ? "border border-slate-700 bg-slate-900 text-slate-200"
                        : "border border-slate-200 bg-slate-100 text-slate-700"
                    }`}
                  >
                    Tech stack
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(currentInterview?.techStack || [])
                      .slice(0, 6)
                      .map((tech) => (
                        <span
                          key={tech}
                          className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-500 ${
                            darkMode
                              ? "border border-cyan-500/20 bg-cyan-500/15 text-cyan-300"
                              : "border border-cyan-200 bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <InterviewProgress
              total={questions.length}
              answered={answeredCount}
              current={currentIndex}
            />

            <div className="dashboard-panel">
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-400">
                Questions
              </p>
              <QuestionNavigator
                questions={questions}
                answers={answers}
                currentIndex={currentIndex}
                onSelect={setCurrentIndex}
              />
            </div>

            {answeredCount === questions.length && (
              <button
                type="button"
                onClick={() =>
                  navigate(`/dashboard/ai-interviews/${id}/result`)
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
              >
                View final result
                <ArrowRight size={18} />
              </button>
            )}
          </aside>

          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            value={drafts[currentIndex] || ""}
            answer={currentAnswer}
            submitting={submittingIndex === currentIndex}
            onChange={(value) =>
              setDrafts((current) => ({ ...current, [currentIndex]: value }))
            }
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </motion.div>
  );
};

export default InterviewSession;
