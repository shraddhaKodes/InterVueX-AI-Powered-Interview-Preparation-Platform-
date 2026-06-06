import { useEffect } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCodingArenaStore } from "../../store/codingArenaStore";

const CodingArena = () => {
  const navigate = useNavigate();
  const { problems, fetchProblems, loading } = useCodingArenaStore();

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Coding arena
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Solve curated challenges
          </h2>
        </div>
      </div>

      <motion.div
        className="dashboard-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 rounded-[1.5rem] bg-slate-900/80"
                />
              ))
            : (problems || []).map((p) => (
                <div
                  key={p._id}
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 transition hover:-translate-y-0.5 hover:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                        {p.difficulty}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300 line-clamp-3">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => navigate(`/coding-arena/${p._id}`)}
                        className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-95"
                      >
                        <Code2 size={16} /> Start
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CodingArena;
