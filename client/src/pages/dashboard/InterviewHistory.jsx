import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import EmptyInterviewState from "../../components/interviews/EmptyInterviewState.jsx";
import InterviewCard from "../../components/interviews/InterviewCard.jsx";
import LoadingInterviewSkeleton from "../../components/interviews/LoadingInterviewSkeleton.jsx";

import { useInterviewStore } from "../../store/interviewStore.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const InterviewHistory = () => {
  const { interviews, loading, error, loadMyInterviews } =
    useInterviewStore();

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    loadMyInterviews({
      page: 1,
      limit: 50,
      sort: "-createdAt",
    }).catch(() => {});
  }, [loadMyInterviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Interview history
          </p>

          <h2
            className={`text-3xl font-semibold transition-all duration-500 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Review every AI session
          </h2>
        </div>

        <Link
          to="/dashboard/ai-interviews/create"
          className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:opacity-95"
        >
          <Plus size={18} />
          New Interview
        </Link>
      </div>

      {/* Content */}
      <section
        className={`dashboard-panel transition-all duration-500 ${
          darkMode
            ? "border border-white/10 bg-slate-950/40"
            : "border border-slate-200 bg-white"
        }`}
      >
        {error && (
          <div
            className={`mb-5 rounded-2xl border p-4 text-sm transition-all duration-500 ${
              darkMode
                ? "border-red-400/20 bg-red-400/10 text-red-100"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {loading ? (
          <LoadingInterviewSkeleton rows={6} />
        ) : interviews.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
              />
            ))}
          </div>
        ) : (
          <EmptyInterviewState />
        )}
      </section>
    </div>
  );
};

export default InterviewHistory;