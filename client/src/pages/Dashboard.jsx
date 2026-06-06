import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import Topbar from "../components/dashboard/Topbar.jsx";
import { useDashboardStore } from "../store/dashboardStore.js";

const Dashboard = () => {
  const { initializeDashboard, overview } = useDashboardStore();

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-glow" />

      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
        <Sidebar />

        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative min-h-screen overflow-hidden py-6 px-4 sm:px-6 lg:px-8"
        >
          <Topbar credits={overview?.userSummary?.creditsRemaining ?? 0} />
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;
