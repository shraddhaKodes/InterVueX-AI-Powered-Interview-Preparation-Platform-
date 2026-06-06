import { Link } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";

const EmptyInterviewState = ({
  title = "No AI interviews yet",
  description = "Create an interview to generate questions and start practicing with AI evaluation.",
}) => {
  return (
    <div className="dashboard-empty py-14 px-8 transition-colors duration-200">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 text-slate-950">
        <Sparkles size={24} />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 dark:text-slate-400">
        {description}
      </p>
      <Link
        to="/dashboard/ai-interviews/create"
        className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:opacity-95"
      >
        <Plus size={18} />
        Create interview
      </Link>
    </div>
  );
};

export default EmptyInterviewState;
