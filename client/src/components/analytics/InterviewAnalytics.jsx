import PerformanceTrendChart from "./PerformanceTrendChart.jsx";
import StrengthWeaknessCard from "./StrengthWeaknessCard.jsx";

const InterviewAnalytics = ({ data }) => {
  return (
    <div className="dashboard-panel p-6">
      <div className="mb-4">
        <div className="text-sm font-bold">Interview analytics</div>
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
          Strengths and difficulty distribution
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Trend
          </div>
          <div className="mt-2 h-60">
            <PerformanceTrendChart data={data?.scoreTrend || []} />
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Avg score
          </div>
          <div className="mt-2 text-4xl font-semibold">
            {data?.avgScore ?? 0}%
          </div>

          <div className="mt-3 space-y-2">
            {(data?.byDifficulty || []).map((d) => (
              <div
                key={d.difficulty}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-600 dark:text-slate-300">
                  {d.difficulty}
                </span>
                <span className="font-semibold">{d.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data?.topStacks?.length ? (
        <div className="mt-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Top topics
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.topStacks.map((t) => (
              <span
                key={t.topic}
                className="rounded-full bg-slate-200/60 px-3 py-1 text-xs"
              >
                {t.topic}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InterviewAnalytics;
