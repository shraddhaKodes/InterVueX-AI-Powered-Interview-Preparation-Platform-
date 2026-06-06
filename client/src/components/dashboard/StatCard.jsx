import { motion } from "framer-motion";

const StatCard = ({ title, value, delta, icon: Icon }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-slate-100 shadow-lg shadow-blue-950/20">
          {Icon ? <Icon size={22} /> : null}
        </div>
      </div>
      <p className="mt-4 text-sm text-emerald-300">{delta}</p>
    </motion.article>
  );
};

export default StatCard;
