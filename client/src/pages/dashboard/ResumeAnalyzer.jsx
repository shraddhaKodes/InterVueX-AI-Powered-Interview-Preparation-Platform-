import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useResumeAnalysisStore } from "../../store/resumeAnalysisStore.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const ResumeAnalyzer = () => {
  const {
    analyze,
    loading,
    score,
    feedbackSummary,
    feedbackSections,
    suggestedImprovements,
    extractedSkills,
    missingSkills,
    error,
  } = useResumeAnalysisStore();

  const { darkMode } = useContext(ThemeContext);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // ---------------- FILE HANDLING ----------------
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleAnalyze = async () => {
    if (file) await analyze(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ---------------- THEME ----------------
  const bgClass = darkMode
    ? "bg-slate-950 text-white"
    : "bg-gray-50 text-slate-900";

  const cardClass = darkMode
    ? "bg-slate-900/60 border-white/10"
    : "bg-white border-gray-200";

  // ---------------- UI ----------------
  return (
    <div className={`min-h-screen p-6 transition-all ${bgClass}`}>
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
          Resume AI Analyzer
        </p>
        <h1 className="text-3xl font-bold">Improve Your Resume</h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: ATS SCORE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-6 shadow-xl ${cardClass}`}
        >
          <p className="text-sm text-gray-400">ATS Score</p>

          <h2 className="text-4xl font-bold mt-2">
            {typeof score === "number" ? `${Math.round(score)}%` : "--"}
          </h2>

          {/* Progress Bar */}
          <div className="mt-4 h-3 w-full rounded-full bg-gray-800">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
              style={{ width: `${score || 0}%` }}
            />
          </div>

          {/* SKILLS */}
          <div className="mt-6 space-y-4">
            {/* Extracted Skills */}
            {extractedSkills?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Extracted Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {missingSkills?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT: UPLOAD */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          className={`rounded-2xl border p-6 shadow-xl transition ${
            dragActive ? "border-blue-400" : ""
          } ${cardClass}`}
        >
          <p className="text-sm text-gray-400">Upload Resume</p>

          <div className="mt-6 border border-dashed rounded-xl p-8 text-center">
            <p className="text-sm text-gray-400">
              Drag & drop your PDF or select file
            </p>

            {/* FILE INPUT */}
            <input
              type="file"
              accept="application/pdf"
              id="resume"
              className="hidden"
              onChange={handleFileChange}
            />

            <label
              htmlFor="resume"
              className="inline-block mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer"
            >
              Choose File
            </label>

            {/* FILE NAME */}
            {file && (
              <p className="mt-3 text-xs text-gray-400">
                Selected: {file.name}
              </p>
            )}

            {/* ANALYZE BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="mt-5 px-6 py-2 rounded-xl bg-green-500 text-white disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            {/* ERROR */}
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* FEEDBACK SUMMARY */}
      {feedbackSummary && (
        <div className={`mt-8 p-5 rounded-xl border ${cardClass}`}>
          <h2 className="font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-gray-400">{feedbackSummary}</p>
        </div>
      )}

      {/* FEEDBACK SECTIONS */}
      {feedbackSections?.length > 0 && (
        <div className="mt-6 space-y-2">
          {feedbackSections.map((f, i) => (
            <p key={i} className="text-sm text-gray-400">
              • {f}
            </p>
          ))}
        </div>
      )}

      {/* IMPROVEMENTS */}
      {suggestedImprovements?.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {suggestedImprovements.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${cardClass}`}
            >
              <h3 className="font-semibold text-sm">
                {item?.title || "Improvement"}
              </h3>
              <p className="text-xs text-gray-400 mt-2">
                {item?.text || item?.description || ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;