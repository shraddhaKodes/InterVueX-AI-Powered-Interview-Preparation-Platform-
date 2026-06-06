import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, CheckCircle2, Clock3 } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const formatDate = (value) => {
  if (!value) {
    return "Not started";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
};

const typeLabels = {
  ai: "AI session",
  technical: "Technical",
  "system-design": "System design",
  behavioral: "Behavioral",
  hr: "HR",
  mock: "Mock",
};

const statusStyles = {
  scheduled: "bg-slate-800 text-slate-300 border border-slate-700/80",
  "in-progress": "bg-indigo-500/10 text-indigo-200 border border-indigo-400/20",
  completed: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/20",
  cancelled: "bg-rose-500/10 text-rose-200 border border-rose-400/20",
  review: "bg-violet-500/10 text-violet-200 border border-violet-400/20",
};

const InterviewCard = ({ interview }) => {
  const { darkMode } = useContext(ThemeContext);

  const id = interview?._id || interview?.id;
  const answered =
    interview?.answers?.filter((answer) => answer.evaluatedAt).length || 0;
  const total = interview?.questions?.length || 0;
  const hasAnswers = answered > 0;
  const typeLabel =
    typeLabels[interview?.interviewType] ||
    interview?.interviewType ||
    "Interview";
  const statusClass = statusStyles[interview?.status] || statusStyles.scheduled;

  const cardClass = darkMode
    ? "dashboard-panel rounded-[2rem] border border-white/10 bg-slate-950/80 text-slate-200 shadow-xl shadow-black/20 transition-all duration-500 hover:-translate-y-0.5 hover:border-cyan-400/20"
    : "dashboard-panel rounded-[2rem] border border-slate-200/70 bg-white/90 text-slate-950 shadow-xl shadow-black/10 transition-all duration-500 hover:-translate-y-0.5 hover:border-cyan-400/20";

  const scoreBoxClass = darkMode
    ? "rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-4 text-center transition-all duration-500 text-sm text-slate-200 shadow-sm"
    : "rounded-[1.5rem] border border-slate-200/70 bg-white/90 px-4 py-4 text-center transition-all duration-500 text-sm text-slate-900 shadow-sm";

  const tagClass = darkMode
    ? "rounded-full border border-slate-700/70 bg-slate-900/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200"
    : "rounded-full border border-slate-200/70 bg-slate-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700";

  return (
    <div className={cardClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p
            className={`text-xs uppercase tracking-[0.3em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {typeLabel} • {interview?.difficulty || "medium"}
          </p>
          <h3
            className={`mt-3 text-2xl font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {interview?.role || "Untitled interview"}
          </h3>
          <p
            className={`mt-2 text-sm leading-6 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {interview?.company || "Company not specified"}
          </p>
        </div>

        <div className={scoreBoxClass}>
          <p
            className={`text-[10px] uppercase tracking-[0.3em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Score
          </p>
          <p className="mt-2 text-3xl font-semibold text-indigo-400">
            {interview?.score || 0}%
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(interview?.techStack || []).slice(0, 5).map((tech) => (
          <span key={tech} className={tagClass}>
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
        <span className="inline-flex items-center gap-2 text-slate-400">
          <CheckCircle2 size={16} />
          {answered}/{total} evaluated
        </span>
        <span className="inline-flex items-center gap-2 text-slate-400">
          <BarChart3 size={16} />
          {interview?.status || "scheduled"}
        </span>
        <span className="inline-flex items-center gap-2 text-slate-400">
          <Clock3 size={16} />
          {formatDate(interview?.createdAt)}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${statusClass}`}
        >
          {interview?.status || "scheduled"}
        </span>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/dashboard/ai-interviews/${id}/session`}
            className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-500 hover:opacity-95"
          >
            {hasAnswers ? "Continue" : "Start session"}
            <ArrowRight size={18} />
          </Link>
          {hasAnswers && (
            <Link
              to={`/dashboard/ai-interviews/${id}/result`}
              className={
                darkMode
                  ? "inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-slate-100"
                  : "inline-flex items-center gap-2 rounded-3xl border border-slate-200/70 bg-slate-100/90 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-slate-200"
              }
            >
              View result
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
