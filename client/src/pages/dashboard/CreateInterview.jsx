import { useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useInterviewStore } from "../../store/interviewStore.js";
import { consumeCredits } from "../../api/creditUsageApi.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const difficultyOptions = ["easy", "medium", "hard"];
const interviewTypeOptions = [
  "technical",
  "system-design",
  "behavioral",
  "hr",
  "ai",
];

const CreateInterview = () => {
  const navigate = useNavigate();
  const { createInterview, generateQuestions, creating, generating, error } =
    useInterviewStore();
  const [form, setForm] = useState({
    role: "",
    company: "",
    difficulty: "medium",
    interviewType: "technical",
    techStack: "",
  });
  const [localError, setLocalError] = useState("");

  const isSubmitting = creating || generating;
  const techStack = useMemo(() => {
    return form.techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.techStack]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const { darkMode } = useContext(ThemeContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!form.role.trim()) {
      setLocalError("Role is required.");
      return;
    }

    // Credit monetization: charge before generating AI questions
    try {
      await consumeCredits({
        featureUsed: "ai-interview",
        creditsConsumed: 1,
      });
    } catch (err) {
      setLocalError(
        err?.response?.data?.message ||
          "Not enough credits. Please buy credits.",
      );
      return;
    }

    try {
      const interview = await createInterview({
        role: form.role.trim(),
        company: form.company.trim(),
        difficulty: form.difficulty,
        interviewType: form.interviewType,
        techStack,
        status: "scheduled",
      });
      const generatedInterview = await generateQuestions(interview._id);

      navigate(`/dashboard/ai-interviews/${generatedInterview._id}/session`);
    } catch {
      // Store-level error is rendered below.
    }
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Create interview
          </p>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Generate a focused AI session
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Build a recruiter-ready interview prompt and launch a premium AI
            practice workflow.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/ai-interviews")}
          className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="dashboard-panel space-y-6"
      >
        {(localError || error) && (
          <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {localError || error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">Role</span>
            <input
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              placeholder="Frontend Engineer"
              className="h-12 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">
              Company
            </span>
            <input
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Google"
              className="h-12 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">
              Difficulty
            </span>
            <select
              value={form.difficulty}
              onChange={(event) =>
                updateField("difficulty", event.target.value)
              }
              className="h-12 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
            >
              {difficultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">
              Interview type
            </span>
            <select
              value={form.interviewType}
              onChange={(event) =>
                updateField("interviewType", event.target.value)
              }
              className="h-12 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
            >
              {interviewTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-300">
            Tech stack
          </span>
          <input
            value={form.techStack}
            onChange={(event) => updateField("techStack", event.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="h-12 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
          />
          <p className="text-xs text-slate-500">
            Separate technologies with commas.
          </p>
        </label>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Generation flow
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              InterVueX will create the interview, call Gemini to generate five
              custom questions, and open your interview session.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Best for
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="rounded-2xl bg-slate-900/80 px-3 py-2">
                Recruiter-ready practice
              </li>
              <li className="rounded-2xl bg-slate-900/80 px-3 py-2">
                AI evaluation & scoring
              </li>
              <li className="rounded-2xl bg-slate-900/80 px-3 py-2">
                Portfolio-friendly interview reviews
              </li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Sparkles size={18} />
          {generating
            ? "Generating questions..."
            : creating
              ? "Creating interview..."
              : "Create and generate"}
        </button>
      </motion.form>
    </div>
  );
};

export default CreateInterview;
