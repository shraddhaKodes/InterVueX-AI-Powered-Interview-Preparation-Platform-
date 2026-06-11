import PerformanceTrendChart from "./PerformanceTrendChart.jsx";

const ResumeAnalytics = ({ data }) => {
  return (
    <div className="dashboard-panel p-6">
      <div className="mb-4">
        <div className="text-sm font-bold">Resume analytics</div>
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
          ATS readiness and gaps
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            ATS trend
          </div>
          <div className="mt-2 h-60">
            <PerformanceTrendChart data={data?.atsTrend || []} />
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Latest ATS score
          </div>
          <div className="mt-2 text-4xl font-semibold">
            {data?.atsScore ?? 0}
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Missing skills
            </div>
            <div className="mt-2 space-y-2">
              {(data?.missingSkills || []).slice(0, 6).map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-300">
                    {s}
                  </span>
                  <span className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-600">
                    Gap
                  </span>
                </div>
              ))}
              {!data?.missingSkills?.length ? (
                <div className="text-sm text-slate-500">No gaps found.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalytics;
