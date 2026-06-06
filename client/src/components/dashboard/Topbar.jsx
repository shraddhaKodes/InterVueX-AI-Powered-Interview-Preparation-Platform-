import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { Bell, ChevronDown, Moon, Search, Sun } from "lucide-react";

const Topbar = ({ credits }) => {
  const [search, setSearch] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const shellClass = darkMode
    ? "rounded-3xl border border-white/10 bg-slate-950/70 p-3 shadow-xl shadow-black/20"
    : "rounded-3xl border border-slate-200/60 bg-white/90 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl";

  const searchClass = darkMode
    ? "flex items-center gap-3 rounded-3xl bg-slate-900/70 px-4 py-3 text-slate-300 shadow-inner shadow-black/20"
    : "flex items-center gap-3 rounded-3xl bg-slate-100/80 px-4 py-3 text-slate-700 shadow-inner shadow-slate-900/10";

  const inputClass = darkMode
    ? "w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
    : "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500";

  const controlButtonClass = darkMode
    ? "inline-flex h-12 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/70 px-4 text-slate-200 transition hover:bg-white/10"
    : "inline-flex h-12 items-center justify-center rounded-3xl border border-slate-200/60 bg-white/90 px-4 text-slate-900 transition hover:bg-slate-100";

  const profileClass = darkMode
    ? "hidden items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 shadow-xl shadow-black/20 lg:flex"
    : "hidden items-center gap-3 rounded-3xl border border-slate-200/60 bg-white/90 px-4 py-3 text-slate-900 shadow-xl shadow-slate-900/10 lg:flex";

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p
            className={`text-sm uppercase tracking-[0.3em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Welcome back, Chloe
          </p>
          <h1
            className={`text-3xl font-semibold tracking-tight sm:text-4xl ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Your interview cockpit
          </h1>
        </div>

        <div className={shellClass}>
          <div className={searchClass}>
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search topics, interviews or notes"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={controlButtonClass}
          aria-label="Toggle theme"
        >
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          <span className="ml-2 text-sm">{darkMode ? "Dark" : "Light"}</span>
        </button>

        <button
          type="button"
          className={controlButtonClass}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="text-sm">Alerts</span>
          <span className="absolute -right-1 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]"></span>
        </button>

        <div className={profileClass}>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-blue-950/30">
            C
          </div>
          <div className="min-w-[160px]">
            <p
              className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Chloe Kim
            </p>
            <p
              className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              AI Interview Coach
            </p>
          </div>
          <ChevronDown
            size={16}
            className={darkMode ? "text-slate-300" : "text-slate-400"}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;
