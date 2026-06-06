import { useEffect } from "react";
import { motion } from "framer-motion";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts.jsx";
import { useDashboardStore } from "../../store/dashboardStore.js";

const AnalyticsPage = () => {
  const { analytics, loading, loadAnalytics } = useDashboardStore();

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Analytics
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Interview performance
          </h2>
        </div>
      </div>

      <motion.div
        className="dashboard-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-[1.5rem] bg-slate-900/80"
              />
            ))}
          </div>
        ) : (
          <AnalyticsCharts analytics={analytics} />
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
