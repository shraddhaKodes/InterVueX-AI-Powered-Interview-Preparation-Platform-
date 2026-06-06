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
    loading,
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
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await runCode({
        problemId,
        sourceCode: code[language],
        language,
        customInput,
      });
    } catch {
      // Store error is rendered in the output console.
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await submitSolution({
        problemId,
        sourceCode: code[language],
        language,
      });
    } catch {
      // Store error is rendered in the output console.
    }
  };

  const outputLogs = error
    ? { error }
    : lastRun || lastSubmission?.result || {};

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
      <div>
        <div className="dashboard-heading">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Problem
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {problem?.title}
            </h2>
          </div>
        </div>

        <div className="dashboard-panel mt-4">
          <p className="text-sm text-slate-400">
            Difficulty: {problem?.difficulty}
          </p>
          <div className="prose mt-4 max-w-none text-sm text-slate-700 dark:text-slate-300">
            <div
              dangerouslySetInnerHTML={{ __html: problem?.description || "" }}
            />
          </div>

          {problem?.examples?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Examples</h4>
              <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-300">
                {problem.examples.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </div>
          )}

          {problem?.constraints?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Constraints</h4>
              <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-300">
                {problem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {problem?.tags?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Tags</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {problem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {problem?.visibleTestCases?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Visible Test Cases</h4>
              <div className="mt-3 space-y-4">
                {problem.visibleTestCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 p-4 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="font-semibold">Test Case {index + 1}</p>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      <p className="font-medium">Input:</p>
                      <pre className="whitespace-pre-wrap rounded bg-slate-100 p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {testCase.input}
                      </pre>
                      <p className="font-medium mt-2">Expected Output:</p>
                      <pre className="whitespace-pre-wrap rounded bg-slate-100 p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {testCase.output}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="dashboard-panel">
          <div className="flex items-center justify-between">
            <LanguageSelector
              language={language}
              languages={LANGUAGE_OPTIONS}
              onSelect={handleLanguageChange}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                className="btn btn-primary"
                disabled={loading || !problemId}
              >
                {loading ? "Running..." : "Run"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-success"
                disabled={loading || !problemId}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
              Please log in to run or submit code. Click here to
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="ml-1 font-semibold text-blue-600 underline"
              >
                log in
              </button>
              .
            </div>
          )}

          <div className="mt-4 h-[420px]">
            <Editor
              height="100%"
              language={LANGUAGE_MAP[language] || "javascript"}
              value={code[language] || ""}
              theme={darkMode ? "vs-dark" : "light"}
              onChange={(val) => handleCodeChange(val)}
              options={{ automaticLayout: true, minimap: { enabled: false } }}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-1">Custom Input</label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={3}
              className="w-full p-2 rounded-md border"
            />
          </div>

          <div className="mt-4">
            <OutputConsole logs={outputLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeEditor;
