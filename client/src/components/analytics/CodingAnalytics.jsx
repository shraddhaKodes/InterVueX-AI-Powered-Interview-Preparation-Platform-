const CodingAnalytics = ({ data }) => {
  const verdictEntries = Object.entries(data?.verdictCounts || {}).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="dashboard-panel p-6">
      <div className="mb-4">
        <div className="text-sm font-bold">Coding analytics</div>
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
          Verdicts and language mix
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Avg coding score
          </div>
          <div className="mt-2 text-4xl font-semibold">
            {data?.avgScore ?? 0}%
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Verdicts
            </div>
            <div className="mt-2 space-y-2">
              {verdictEntries.slice(0, 6).map(([v, c]) => (
                <div
                  key={v}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-600 dark:text-slate-300">
                    {v}
                  </span>
                  <span className="font-semibold">{c}</span>
                </div>
              ))}
              {!verdictEntries.length ? (
                <div className="text-sm text-slate-500">
                  No submissions yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Top languages
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(data?.topLanguages || []).map((l) => (
              <span
                key={l.language}
                className="rounded-full bg-slate-200/60 px-3 py-1 text-xs"
              >
                {l.language} ({l.count})
              </span>
            ))}
            {!data?.topLanguages?.length ? (
              <div className="text-sm text-slate-500">No coding data yet.</div>
            ) : null}
          </div>

          {data?.weakestVerdict ? (
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Weakest verdict:{" "}
              <span className="font-semibold">{data.weakestVerdict}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CodingAnalytics;
