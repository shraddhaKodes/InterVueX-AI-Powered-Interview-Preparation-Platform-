import { useContext } from "react";
import { CheckCircle2 } from "lucide-react";
import RubricDisplay from "./RubricDisplay.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const formatDateTime = (value) => {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const FeedbackCard = ({ answer }) => {
  const { darkMode } = useContext(ThemeContext);

  if (!answer?.evaluatedAt) {
    return null;
  }

  const panelClass = darkMode
    ? "dashboard-panel border-white/10 bg-slate-950/80 text-slate-200 shadow-sm shadow-emerald-400/10 p-5 transition-all duration-500"
    : "dashboard-panel border-slate-200/70 bg-white/90 text-slate-900 shadow-sm shadow-emerald-500/10 p-5 transition-all duration-500";

  const scoreClass = darkMode
    ? "rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 text-center transition-all duration-500"
    : "rounded-[1.5rem] border border-slate-200/70 bg-white/90 p-5 text-center transition-all duration-500";

  const feedbackItems = Array.isArray(answer.feedback)
    ? answer.feedback
    : answer.feedback
    ? [answer.feedback]
    : [];

  return (
    <div className={panelClass}>
      <div className="grid gap-5 lg:grid-cols-[1fr_160px]">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            <p
              className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                darkMode ? "text-slate-100" : "text-slate-900"
              }`}
            >
              AI Evaluation
            </p>
          </div>

          {feedbackItems.length > 0 ? (
            <ul
              className={`mt-4 space-y-3 text-sm ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {feedbackItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 leading-6"
                >
                  <span className="mt-1 text-emerald-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`mt-4 text-sm leading-7 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              No feedback available.
            </p>
          )}

          <p
            className={`mt-5 text-xs uppercase tracking-[0.22em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Evaluated at {formatDateTime(answer.evaluatedAt)}
          </p>
        </div>

        <div className={scoreClass}>
          <p
            className={`text-xs uppercase tracking-[0.22em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Score
          </p>

          <p className="mt-3 text-4xl font-semibold text-indigo-400">
            {answer.score ?? 0}
          </p>

          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-slate-500" : "text-slate-700"
            }`}
          >
            Answer Quality
          </p>
        </div>
      </div>

      <div className="mt-5">
        <RubricDisplay rubric={answer.rubric} />
      </div>
    </div>
  );
};

export default FeedbackCard;