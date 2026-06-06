const InterviewProgress = ({ total = 0, answered = 0, current = 0 }) => {
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="dashboard-panel p-5 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Progress
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            Question {Math.min(current + 1, total || 1)} of {total}
          </p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
          {answered}/{total} answered
        </span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default InterviewProgress;
