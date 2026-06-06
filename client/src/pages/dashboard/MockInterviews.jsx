import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDashboardStore } from "../../store/dashboardStore.js";

const MockInterviews = () => {
  const { interviews, loading, loadInterviews } = useDashboardStore();

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Mock interviews
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Practice rounds
          </h2>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="grid gap-4 lg:grid-cols-2">
          {(loading ? Array.from({ length: 4 }) : interviews).map(
            (item, index) => (
              <motion.div
                key={item?.id ?? index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/10"
              >
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 w-24 rounded-full bg-slate-800/80" />
                    <div className="h-4 w-32 rounded-full bg-slate-800/80" />
                    <div className="h-3 w-20 rounded-full bg-slate-800/80" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      {item.difficulty}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {item.topic}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.score}% score — {item.duration} — {item.date}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
                        {item.questions} Qs
                      </span>
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                        {item.status}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviews;
