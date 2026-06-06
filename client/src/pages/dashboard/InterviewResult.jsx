import { useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import FeedbackCard from "../../components/interviews/FeedbackCard.jsx";
import LoadingInterviewSkeleton from "../../components/interviews/LoadingInterviewSkeleton.jsx";
import { useInterviewStore } from "../../store/interviewStore.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const typeLabels = {
  ai: "AI session",
  technical: "Technical",
  "system-design": "System design",
  behavioral: "Behavioral",
  hr: "HR",
  mock: "Mock",
};

const statusStyles = {
  scheduled: {
    dark: "bg-slate-800 text-slate-300 border border-white/5",
    light: "bg-slate-100 text-slate-600 border border-slate-200"
  },
  "in-progress": {
    dark: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
    light: "bg-indigo-500/10 text-indigo-600 border border-indigo-100"
  },
  completed: {
    dark: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    light: "bg-emerald-500/10 text-emerald-600 border border-emerald-100"
  },
  cancelled: {
    dark: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    light: "bg-rose-500/10 text-rose-600 border border-rose-100"
  },
  review: {
    dark: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
    light: "bg-violet-500/10 text-violet-600 border border-violet-100"
  }
};

const InterviewResult = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const { currentInterview, loading, error, loadInterview } = useInterviewStore();

  useEffect(() => {
    loadInterview(id).catch(() => {});
  }, [id, loadInterview]);

  // Comprehensive theme design tokens
  const panelClass = darkMode ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white";
  
  const cardClass = darkMode
    ? "rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300"
    : "rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md transition-all duration-300";

  const subCardClass = darkMode
    ? "rounded-[1.25rem] border border-white/5 bg-slate-900/40 p-4 transition-all duration-300"
    : "rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 transition-all duration-300";

  const answerBoxClass = darkMode
    ? "mt-4 rounded-[1.5rem] border border-white/5 bg-slate-950/40 p-5 transition-all duration-300"
    : "mt-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 transition-all duration-300";

  const navButtonClass = darkMode
    ? "border border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800"
    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100";

  // Point 4: Cleaner, softer theme badges
  const badgeClass = darkMode
    ? "border border-slate-700 bg-slate-900/80 text-slate-200"
    : "border border-slate-200 bg-slate-50 text-slate-700";

  const headingClass = darkMode ? "text-white" : "text-slate-900";
  const textClass = darkMode ? "text-slate-300" : "text-slate-600";
  const labelMutedClass = darkMode ? "text-slate-500" : "text-slate-400";

  const answers = currentInterview?.answers || [];
  const evaluatedAnswers = answers.filter((answer) => answer.evaluatedAt);
  const feedback = currentInterview?.feedback || {};
  const interviewType = typeLabels[currentInterview?.interviewType] || "AI session";
  const score = currentInterview?.score ?? 0;
  
  const currentStatus = currentInterview?.status || "scheduled";
  const statusClass = darkMode 
    ? (statusStyles[currentStatus]?.dark || statusStyles.scheduled.dark)
    : (statusStyles[currentStatus]?.light || statusStyles.scheduled.light);

  if (loading && !currentInterview) {
    return <LoadingInterviewSkeleton rows={3} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6" // Point 2: Removed wrapper layout backgrounds to preserve global dashboard layout harmony
    >
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
            Result
          </p>
          <h2 className={`mt-2 text-3xl font-semibold tracking-tight ${headingClass}`}>
            {currentInterview?.role || "Interview result"}
          </h2>
        </div>
        <Link
          to={`/dashboard/ai-interviews/${id}/session`}
          className={`inline-flex items-center gap-2 rounded-3xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 shadow-sm self-start sm:self-center ${navButtonClass}`}
        >
          <ArrowLeft size={18} />
          Back to session
        </Link>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={`rounded-[1.5rem] border p-4 text-sm font-medium text-rose-500 transition-all duration-300 ${panelClass}`}>
          {error}
        </div>
      )}

      {/* Primary Insights Split View */}
      <section className={`rounded-[2rem] border p-6 shadow-sm backdrop-blur-xl ${panelClass}`}>
        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
          
          {/* Performance Summary Card */}
          <div className={cardClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
                  Overall score
                </p>
                <h3 className={`mt-3 text-5xl font-extrabold tracking-tight ${headingClass}`}>
                  {score}%
                </h3>
              </div>
              <div className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${statusClass}`}>
                {currentStatus}
              </div>
            </div>
            <p className={`mt-4 text-xs font-medium leading-relaxed ${labelMutedClass}`}>
              {evaluatedAnswers.length} of {currentInterview?.questions?.length || 0} questions evaluated.
            </p>
            
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className={subCardClass}>
                <p className={`text-xs uppercase tracking-[0.22em] font-bold ${labelMutedClass}`}>
                  Interview type
                </p>
                <p className={`mt-1.5 text-sm font-semibold ${headingClass}`}>
                  {interviewType}
                </p>
              </div>
              <div className={subCardClass}>
                <p className={`text-xs uppercase tracking-[0.22em] font-bold ${labelMutedClass}`}>
                  Duration
                </p>
                <p className={`mt-1.5 text-sm font-semibold ${headingClass}`}>
                  {currentInterview?.duration || 0} mins
                </p>
              </div>
            </div>
            
            {/* Point 1: Cleared Tailwind dark: variations from CTA action route button */}
            <Link
              to={`/dashboard/ai-interviews/${id}/session`}
              className={`mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 px-4 py-3 text-sm font-semibold shadow-md transition hover:opacity-95 ${
                darkMode
                  ? "text-slate-950 shadow-blue-950/20"
                  : "text-white shadow-blue-500/10"
              }`}
            >
              <RotateCcw size={16} />
              Continue practice
            </Link>
          </div>

          {/* AI Comprehensive Feedback Summary Blocks */}
          <div className="space-y-4">
            <div className={cardClass}>
              <p className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
                AI feedback summary
              </p>
              <h3 className={`mt-3 text-lg font-medium leading-relaxed ${headingClass}`}>
                {feedback.summary || "Review your last AI evaluation"}
              </h3>
              
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {feedback.strengths?.length > 0 && (
                  <div className={subCardClass}>
                    <p className={`text-xs uppercase tracking-[0.22em] font-bold ${labelMutedClass} mb-3`}>
                      Strengths
                    </p>
                    <ul className="space-y-2 text-sm">
                      {feedback.strengths.map((item, index) => (
                        <li
                          key={index}
                          className={`rounded-xl px-3 py-2 text-xs font-medium leading-relaxed shadow-sm ${
                            darkMode ? "bg-slate-950/60 text-slate-300 border border-white/5" : "bg-white text-slate-700 border border-slate-200/60"
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.improvements?.length > 0 && (
                  <div className={subCardClass}>
                    <p className={`text-xs uppercase tracking-[0.22em] font-bold ${labelMutedClass} mb-3`}>
                      Improvements
                    </p>
                    <ul className="space-y-2 text-sm">
                      {feedback.improvements.map((item, index) => (
                        <li
                          key={index}
                          className={`rounded-xl px-3 py-2 text-xs font-medium leading-relaxed shadow-sm ${
                            darkMode ? "bg-slate-950/60 text-slate-300 border border-white/5" : "bg-white text-slate-700 border border-slate-200/60"
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Meta Tracker Panel */}
            <div className={cardClass}>
              <p className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
                AI metadata
              </p>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className={subCardClass}>
                  <p className={`text-xs uppercase tracking-[0.2em] font-bold ${labelMutedClass}`}>
                    Provider
                  </p>
                  <p className={`mt-1.5 text-sm font-semibold ${headingClass}`}>
                    {currentInterview?.aiMetadata?.provider || "gemini"}
                  </p>
                </div>
                <div className={subCardClass}>
                  <p className={`text-xs uppercase tracking-[0.2em] font-bold ${labelMutedClass}`}>
                    Generated
                  </p>
                  <p className={`mt-1.5 text-sm font-semibold ${headingClass}`}>
                    {currentInterview?.aiMetadata?.generatedAt
                      ? new Date(currentInterview.aiMetadata.generatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Question Detail Assessment Streams */}
      <section className="space-y-4">
        {evaluatedAnswers.length > 0 ? (
          evaluatedAnswers
            .sort((a, b) => a.questionIndex - b.questionIndex)
            .map((answer) => (
              <div key={answer.questionIndex} className={`rounded-[2rem] border p-6 shadow-sm backdrop-blur-xl ${panelClass}`}>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <p className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
                      Question {answer.questionIndex + 1}
                    </p>
                    <h3 className={`mt-2.5 text-lg font-semibold tracking-tight leading-snug ${headingClass}`}>
                      {answer.question}
                    </h3>
                  </div>
                  <div className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] self-start xl:self-auto shadow-sm ${badgeClass}`}>
                    Answer score: {answer.score}%
                  </div>
                </div>
                
                <div className={answerBoxClass}>
                  <p className={`text-sm leading-7 font-medium ${textClass}`}>
                    {answer.answer}
                  </p>
                </div>
                
                <div className="mt-5">
                  <FeedbackCard answer={answer} />
                </div>
              </div>
            ))
        ) : (
          <div className={`rounded-[2rem] border p-12 text-center shadow-sm ${panelClass}`}>
            <h3 className={`text-xl font-semibold tracking-tight ${headingClass}`}>
              No evaluated answers yet
            </h3>
            <p className={`mt-2 text-sm max-w-sm mx-auto ${labelMutedClass}`}>
              Submit at least one answer in the session to see AI feedback here.
            </p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default InterviewResult;