import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";

const formatElapsed = (seconds) => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(
    minutes,
  ).padStart(2, "0")}m ${String(remainingSeconds).padStart(2, "0")}s`;
};
const InterviewTimer = ({ startedAt }) => {
  const startTime = useMemo(() => {
    if (!startedAt) return Date.now();

    const timestamp = new Date(startedAt).getTime();

    return isNaN(timestamp) ? Date.now() : timestamp;
  }, [startedAt]);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const updateElapsed = () => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(Math.max(0, seconds));
    };

    updateElapsed();

    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-200/70 bg-slate-100/90 px-4 py-3 text-sm font-semibold text-slate-900 transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200">
      <Clock3 size={18} className="text-cyan-200" />
      {formatElapsed(elapsed)}
    </div>
  );
};

export default InterviewTimer;
