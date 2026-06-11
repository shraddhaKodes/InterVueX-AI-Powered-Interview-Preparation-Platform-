import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCodingArenaStore } from "../../store/codingArenaStore";
import OutputConsole from "./OutputConsole";
import LanguageSelector from "./LanguageSelector";
import {
  DEFAULT_CODE,
  getStarterCode,
  LANGUAGE_MAP,
  LANGUAGE_OPTIONS,
} from "./languageConfig";
import Editor from "@monaco-editor/react";

const ChallengeEditor = ({ problemId }) => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();

  const [codeState, setCodeState] = useState({
    problemKey: null,
    values: DEFAULT_CODE,
  });

  const [language, setLanguage] = useState("javascript");
  const [customInput, setCustomInput] = useState("");

  const {
    fetchProblem,
    problem,
    runCode,
    submitSolution,
    lastRun,
    lastSubmission,
    running,
    submitting,
    error,
  } = useCodingArenaStore();

  useEffect(() => {
    if (problemId) fetchProblem(problemId);
  }, [fetchProblem, problemId]);

  const problemKey = problem?._id || problemId || "default";

  const starterCode = useMemo(
    () => getStarterCode(problem?.starterCode),
    [problem?.starterCode],
  );

  const code =
    codeState.problemKey === problemKey ? codeState.values : starterCode;

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
  };

  const handleCodeChange = (value) => {
    setCodeState((prev) => {
      const values = prev.problemKey === problemKey ? prev.values : starterCode;

      return {
        problemKey,
        values: {
          ...values,
          [language]: value || "",
        },
      };
    });
  };

  const handleRun = async () => {
    if (!isAuthenticated) return navigate("/login");

    await runCode({
      problemId,
      sourceCode: code[language],
      language,
      customInput,
    });
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) return navigate("/login");

    await submitSolution({
      problemId,
      sourceCode: code[language],
      language,
    });
  };

  const outputLogs = error
    ? { error }
    : lastRun || lastSubmission?.result || {};

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
      {/* LEFT PANEL */}
      <div>
        <div className="dashboard-heading">
          <div>
            <p
              className={`text-sm uppercase tracking-[0.24em] ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Problem
            </p>

            <h2
              className={`text-2xl font-semibold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {problem?.title}
            </h2>
          </div>
        </div>

        <div
          className={`dashboard-panel mt-4 ${
            darkMode
              ? "bg-slate-900/40 border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Difficulty: {problem?.difficulty}
          </p>

          <div
            className={`prose mt-4 max-w-none text-sm ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: problem?.description || "",
              }}
            />
          </div>

          {/* Examples */}
          {problem?.examples?.length > 0 && (
            <div className="mt-4">
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Examples
              </h4>

              <ul
                className={`list-disc pl-5 mt-2 text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {problem.examples.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Constraints */}
          {problem?.constraints?.length > 0 && (
            <div className="mt-4">
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Constraints
              </h4>

              <ul
                className={`list-disc pl-5 mt-2 text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {problem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {problem?.tags?.length > 0 && (
            <div className="mt-4">
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Tags
              </h4>

              <div className="mt-2 flex flex-wrap gap-2">
                {problem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full px-3 py-1 text-xs border ${
                      darkMode
                        ? "border-slate-700 text-slate-200 bg-slate-800"
                        : "border-slate-300 text-slate-700 bg-slate-100"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Test Cases */}
          {problem?.visibleTestCases?.length > 0 && (
            <div className="mt-4">
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Visible Test Cases
              </h4>

              <div className="mt-3 space-y-4">
                {problem.visibleTestCases.map((tc, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border p-4 ${
                      darkMode
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="font-semibold">Test Case {index + 1}</p>

                    <div
                      className={`mt-2 text-sm ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      <p className="font-medium">Input:</p>
                      <pre
                        className={`whitespace-pre-wrap rounded p-2 text-xs ${
                          darkMode
                            ? "bg-slate-800 text-slate-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tc.input}
                      </pre>

                      <p className="font-medium mt-2">Expected Output:</p>
                      <pre
                        className={`whitespace-pre-wrap rounded p-2 text-xs ${
                          darkMode
                            ? "bg-slate-800 text-slate-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tc.output}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div>
        <div
          className={`dashboard-panel ${
            darkMode
              ? "bg-slate-900/40 border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <LanguageSelector
              language={language}
              languages={LANGUAGE_OPTIONS}
              onSelect={handleLanguageChange}
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running || submitting || !problemId}
                className="btn btn-primary"
              >
                {running ? "Running..." : "Run"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={running || submitting || !problemId}
                className="btn btn-success"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Auth warning */}
          {!isAuthenticated && (
            <div
              className={`mt-4 rounded-lg border p-4 text-sm ${
                darkMode
                  ? "border-yellow-700 bg-yellow-900/20 text-yellow-200"
                  : "border-yellow-300 bg-yellow-50 text-yellow-900"
              }`}
            >
              Please log in to run or submit code.
              <button
                onClick={() => navigate("/login")}
                className="ml-2 font-semibold text-blue-600 underline"
              >
                Login
              </button>
            </div>
          )}

          {/* Editor */}
          <div className="mt-4 h-[420px]">
            <Editor
              height="100%"
              language={LANGUAGE_MAP[language] || "javascript"}
              value={code[language] || ""}
              theme={darkMode ? "vs-dark" : "light"}
              onChange={handleCodeChange}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
              }}
            />
          </div>

          {/* Custom Input */}
          <div className="mt-4">
            <label
              className={`block mb-1 ${
                darkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              Custom Input
            </label>

            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={3}
              className={`w-full p-2 rounded-md border ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Output */}
          <div className="mt-4">
            <OutputConsole logs={outputLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeEditor;
