import { useContext } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Cpu,
  LayoutDashboard,
  TerminalSquare,
  FileCheck2,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useDashboardStore } from "../../store/dashboardStore.js";

const navItemsBase = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "AI Interviews", path: "/dashboard/ai-interviews", icon: Activity },
  { label: "Resume Analyzer", path: "/dashboard/resume", icon: FileCheck2 },
  { label: "Coding Arena", path: "/dashboard/coding", icon: Cpu },
  { label: "Submissions", path: "/dashboard/coding/history", icon: FileCheck2 },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Payments", path: "/dashboard/payments", icon: CreditCard },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const navItems = (user) => {
  const base = [...navItemsBase];
  if (user?.role === "admin") {
    base.splice(5, 0, {
      label: "Manage User",
      path: "/dashboard/coding/admin",
      icon: FileCheck2,
    });
  }

  return base;
};

const Sidebar = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const { overview } = useDashboardStore();

  const creditsRemaining = overview?.userSummary?.creditsRemaining ?? 0;

  const asideClass = darkMode
    ? "hidden lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:gap-8 lg:border-r lg:border-white/10 lg:bg-slate-950/75 lg:px-6 lg:py-8 lg:text-slate-100 lg:backdrop-blur-xl"
    : "hidden lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:gap-8 lg:border-r lg:border-slate-200/70 lg:bg-white/90 lg:px-6 lg:py-8 lg:text-slate-900 lg:backdrop-blur-xl";

  const brandCardClass = darkMode
    ? "flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-white shadow-xl shadow-black/20"
    : "flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-white p-4 text-slate-900 shadow-xl shadow-slate-900/10";

  const creditsCardClass = darkMode
    ? "mt-auto rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-slate-300 shadow-inner shadow-black/20"
    : "mt-auto rounded-3xl border border-slate-200/70 bg-white/95 p-5 text-slate-700 shadow-xl shadow-slate-900/10";

  const mobileNavClass = darkMode
    ? "fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/95 px-3 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden"
    : "fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-3xl border border-slate-200/70 bg-white/95 px-3 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:hidden";

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
        className={asideClass}
      >
        <div className="space-y-6">
          <NavLink to="/" className={brandCardClass}>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-blue-950/30">
              <Sparkles size={24} />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                InterVueX
              </p>
              <p
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-slate-950"
                }`}
              >
                AI Command Center
              </p>
            </div>
          </NavLink>

          <nav className="space-y-1">
            {navItems(user).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? darkMode
                          ? "bg-gradient-to-r from-blue-500/25 to-violet-500/25 text-white shadow-lg shadow-blue-950/20"
                          : "bg-gradient-to-r from-blue-50 to-violet-50 text-slate-950 shadow-sm ring-1 ring-slate-200/70"
                        : darkMode
                          ? "text-slate-300 hover:bg-white/10 hover:text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-5 w-5 transition ${
                          isActive
                            ? darkMode
                              ? "text-cyan-200"
                              : "text-blue-600"
                            : darkMode
                              ? "text-slate-500 group-hover:text-cyan-200"
                              : "text-slate-500 group-hover:text-blue-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className={creditsCardClass}>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
            Credits
          </p>
          <p
            className={`mt-4 text-3xl font-semibold ${
              darkMode ? "text-white" : "text-slate-950"
            }`}
          >
            {creditsRemaining}
          </p>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Premium plan remaining credits.
          </p>
        </div>
      </motion.aside>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={mobileNavClass}
        onClick={(e) => {
          // Prevent any unexpected parent click handlers from navigating.
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar w-full">
          {navItems(user).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `grid h-12 w-12 place-items-center rounded-2xl shrink-0 transition ${
                    isActive
                      ? darkMode
                        ? "bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-white"
                        : "bg-gradient-to-br from-blue-50 to-violet-50 text-blue-700 ring-1 ring-slate-200/70"
                      : darkMode
                        ? "text-slate-400 hover:bg-white/10 hover:text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon size={20} />
              </NavLink>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
