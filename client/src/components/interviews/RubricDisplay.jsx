const RUBRIC_LABELS = {
  correctness: "Correctness",
  communication: "Communication",
  depth: "Depth",
  tradeoffs: "Tradeoffs",
  codeQuality: "Code quality",
};

const getBarColor = (value) => {
  if (value >= 80) return "from-emerald-400 via-cyan-400 to-indigo-500";
  if (value >= 60) return "from-amber-400 via-orange-400 to-rose-400";
  return "from-rose-400 via-fuchsia-400 to-violet-500";
};

const RubricDisplay = ({ rubric = {} }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {Object.entries(RUBRIC_LABELS).map(([key, label]) => {
        const value = Number(rubric?.[key] || 0);
        const gradient = getBarColor(value);

        return (
          <div
            key={key}
            className="rounded-[1.5rem] border border-slate-200/70 bg-white/90 p-4 transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/70"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {value}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                style={{ width: `${Math.min(value, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RubricDisplay;
