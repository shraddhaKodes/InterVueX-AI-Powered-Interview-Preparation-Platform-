import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { History, Plus, Sparkles } from "lucide-react";
import EmptyInterviewState from "../../components/interviews/EmptyInterviewState.jsx";
import InterviewCard from "../../components/interviews/InterviewCard.jsx";
import LoadingInterviewSkeleton from "../../components/interviews/LoadingInterviewSkeleton.jsx";
import { useInterviewStore } from "../../store/interviewStore.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const AIInterviews = () => {
  // Global context usage
  const { darkMode } = useContext(ThemeContext);
  const { interviews, loading, error, loadMyInterviews } = useInterviewStore();
  
  useEffect(() => {
    loadMyInterviews({ page: 1, limit: 6, sort: "-createdAt" }).catch(() => {});
  }, [loadMyInterviews]);

  const totalQuestions = interviews.reduce((total, interview) => {
    return total + (interview.questions?.length || 0);
  }, 0);
  
  const averageScore = interviews.length
    ? Math.round(
        interviews.reduce(
          (total, interview) => total + (interview.score || 0),
          0,
        ) / interviews.length,
      )
    : 0;

  // Design system style variables mapped to ThemeContext state
  const headingClass = darkMode ? "text-white" : "text-slate-900";
  const labelMutedClass = darkMode ? "text-slate-500" : "text-slate-400";
  
  const historyBtnClass = darkMode
    ? "border border-white/10 bg-slate-950/70 text-slate-200 hover:bg-white/10"
    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100";

  const createBtnClass = `inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-5 py-3 text-sm font-semibold shadow-md transition hover:opacity-95 ${
    darkMode 
      ? "text-slate-950 shadow-blue-950/20" 
      : "text-white shadow-blue-500/10"
  }`;

  return (
    <div className="space-y-6">
      {/* Upper Dashboard Header Navigation */}
      <div className="dashboard-heading">
        <div>
          <p className={`text-sm uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
            AI Interviews
          </p>
          <h2 className={`mt-2 text-3xl font-semibold tracking-tight ${headingClass}`}>
            Practice with live AI evaluation
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/ai-interviews/history"
            className={`inline-flex items-center gap-2 rounded-3xl px-5 py-3 text-sm font-semibold transition shadow-sm ${historyBtnClass}`}
          >
            <History size={18} />
            History
          </Link>
          <Link
            to="/dashboard/ai-interviews/create"
            className={createBtnClass}
          >
            <Plus size={18} />
            Create interview
          </Link>
        </div>
      </div>

      {/* Aggregate Statistics Matrix Panel Section */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Sessions", interviews.length],
          ["Generated questions", totalQuestions],
          ["Average score", `${averageScore}%`],
        ].map(([label, value]) => (
          <div key={label} className="dashboard-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-xs uppercase tracking-[0.24em] font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {label}
                </p>
                <p className={`mt-2 text-3xl font-semibold ${headingClass}`}>
                  {value}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/10">
                <Sparkles size={20} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Stream Management Workspace Container */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="dashboard-panel"
      >
        <div className="dashboard-heading mb-6">
          <div>
            <p className={`text-sm uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}>
              Recent sessions
            </p>
            <h3 className={`mt-2 text-xl font-semibold ${headingClass}`}>
              Continue where you left off
            </h3>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingInterviewSkeleton />
        ) : interviews.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {interviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        ) : (
          <EmptyInterviewState />
        )}
      </motion.section>
    </div>
  );
};

export default AIInterviews;