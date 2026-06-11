const StrengthWeaknessCard = ({ strengths = [], weaknesses = [] }) => {
  return (
    <div className="dashboard-panel p-6">
      <div className="mb-4">
        <div className="text-sm font-bold">Strengths & weaknesses</div>
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
          AI coaching snapshot
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Strengths
          </div>
          <ul className="mt-2 space-y-2">
            {strengths.slice(0, 6).map((s, i) => (
              <li key={i} className="text-sm">
                • {s}
              </li>
            ))}
            {!strengths.length ? (
              <li className="text-sm text-slate-500">No strengths yet.</li>
            ) : null}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Weaknesses
          </div>
          <ul className="mt-2 space-y-2">
            {weaknesses.slice(0, 6).map((s, i) => (
              <li key={i} className="text-sm">
                • {s}
              </li>
            ))}
            {!weaknesses.length ? (
              <li className="text-sm text-slate-500">No weaknesses yet.</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrengthWeaknessCard;
