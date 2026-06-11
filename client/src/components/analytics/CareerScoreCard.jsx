import { useMemo } from "react";

const CareerScoreCard = ({ score = 0 }) => {
  const s = useMemo(() => {
    const n = Number(score);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  }, [score]);

  const label =
    s >= 80
      ? "Excellent"
      : s >= 60
        ? "On track"
        : s >= 40
          ? "Improving"
          : "Needs focus";

  return (
    <div className="dashboard-panel">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
        Career readiness
      </div>
      <div className="mt-2 text-4xl font-semibold">{s}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
};

export default CareerScoreCard;
