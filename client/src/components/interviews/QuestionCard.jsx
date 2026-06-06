import { lazy, Suspense, useContext } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import FeedbackCard from "./FeedbackCard.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
const Editor = lazy(() => import("@monaco-editor/react"));
const isCodingQuestion = (question) => {
  return question?.category === "coding";
};

const QuestionCard = ({
  question,
  index,
  value,
  answer,
  onChange,
  onSubmit,
  submitting,
}) => {
  const coding = isCodingQuestion(question);
  const { darkMode } = useContext(ThemeContext);
  const statusLabel = answer?.evaluatedAt ? "Evaluated" : "Pending evaluation";

  const questionTextClass = darkMode
    ? "mt-4 text-xl sm:text-2xl font-medium leading-relaxed text-white transition-all duration-500"
    : "mt-4 text-xl sm:text-2xl font-medium leading-relaxed text-slate-900 transition-all duration-500";

  const statusCardClass = darkMode
    ? "rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center text-sm text-slate-200 transition-all duration-500"
    : "rounded-3xl border border-slate-200/70 bg-white/90 px-4 py-3 text-center text-sm text-slate-900 transition-all duration-500";

  const editorShellClass = darkMode
    ? "rounded-[1.75rem] border border-white/10 bg-slate-900 p-4 sm:p-6 transition-all duration-500"
    : "rounded-[1.75rem] border border-slate-200 bg-white p-4 sm:p-6 transition-all duration-500";

  const textAreaClass = darkMode
    ? "min-h-[280px] w-full resize-y rounded-[1.25rem] border border-white/10 bg-slate-950 p-5 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-500"
    : "min-h-[280px] w-full resize-y rounded-[1.25rem] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-500";

  const labelTextClass = darkMode ? "text-slate-400" : "text-slate-500";
  const valueTextClass = darkMode ? "text-white" : "text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard-panel space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
<div className="flex flex-wrap items-center gap-2">
  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
    Question {index + 1}
  </span>

  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
      darkMode
        ? "bg-slate-800 text-slate-200"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    {question?.category || "technical"}
  </span>

  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
      darkMode
        ? "bg-violet-500/15 text-violet-300"
        : "bg-violet-100 text-violet-700"
    }`}
  >
    {question?.difficulty || "medium"}
  </span>
</div>
          <p className={questionTextClass}>{question?.question}</p>
        </div>

        <div className={statusCardClass}>
          <p className={`uppercase tracking-[0.2em] text-xs ${labelTextClass}`}>
            Status
          </p>
          <p className={valueTextClass}>{statusLabel}</p>
          {answer?.score != null && (
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {answer.score}%
            </p>
          )}
        </div>
      </div>

      <div className={editorShellClass}>
        {coding ? (
          <Suspense
            fallback={
              <div
                className={`grid h-[360px] place-items-center rounded-[1.5rem] text-sm ${
                  darkMode
                    ? "bg-slate-950 text-slate-400"
                    : "bg-slate-100/80 text-slate-700"
                }`}
              >
                Loading editor...
              </div>
            }
          >
            <Editor
              height="360px"
              defaultLanguage="javascript"
              theme={darkMode ? "vs-dark" : "light"}
              value={value}
              onChange={(nextValue) => onChange(nextValue || "")}
            />
          </Suspense>
        ) : (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={12}
            placeholder="Type your answer with clear reasoning, examples, and tradeoffs."
            className={textAreaClass}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Submit your answer to receive AI evaluation and preserve your progress
          for this session.
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || !value.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Evaluating..."
            : answer?.evaluatedAt
              ? "Re-evaluate answer"
              : "Submit answer"}
          <Send size={18} />
        </button>
      </div>

      <FeedbackCard answer={answer} />
    </motion.div>
  );
};

export default QuestionCard;
