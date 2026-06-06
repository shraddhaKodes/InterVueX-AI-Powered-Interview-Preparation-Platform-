const LoadingInterviewSkeleton = ({ rows = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[1.5rem] border border-slate-200/70 bg-slate-100/80 p-5 transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/60"
        >
          <div className="h-3 w-28 rounded-full bg-slate-300/70 dark:bg-slate-800/80" />
          <div className="mt-4 h-5 w-2/3 rounded-full bg-slate-300/70 dark:bg-slate-800/80" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="h-10 rounded-2xl bg-slate-300/70 dark:bg-slate-800/80" />
            <div className="h-10 rounded-2xl bg-slate-300/70 dark:bg-slate-800/80" />
            <div className="h-10 rounded-2xl bg-slate-300/70 dark:bg-slate-800/80" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingInterviewSkeleton;
