import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const OutputConsole = ({ logs = {} }) => {
  const { darkMode } = useContext(ThemeContext);
  const {
    output,
    error,
    executionTime,
    memoryUsage,
    testcaseResults,
    results,
    executionLogs,
  } = logs || {};

  const testResults = testcaseResults || results || executionLogs;
  const displayOutput = output || "";
  const displayError = error || "";

  const panelClass = darkMode
    ? "rounded-lg border border-white/10 bg-slate-950/80 p-3 text-slate-200"
    : "rounded-lg border border-slate-200/70 bg-white p-3 text-slate-900";

  const outputClass = darkMode
    ? "bg-black/80 text-white p-3 rounded"
    : "bg-slate-100 p-3 rounded text-slate-900";

  return (
    <div className={panelClass}>
      <h4 className="font-semibold">Output</h4>
      <pre className={outputClass}>{displayOutput || "No output yet."}</pre>

      {displayError && (
        <>
          <h5 className="mt-2 font-semibold">Errors</h5>
          <pre className="bg-red-900/80 text-white p-3 rounded">
            {displayError}
          </pre>
        </>
      )}

      {(executionTime != null || memoryUsage != null) && (
        <div className="mt-3 text-sm">
          <p>Execution Time: {executionTime}s</p>
          <p>Memory Usage: {memoryUsage}</p>
        </div>
      )}

      {testResults && (
        <div className="mt-4">
          <h5 className="font-semibold">Test Results</h5>
          <ul className="list-disc pl-6">
            {testResults.map((result, index) => (
              <li key={index} className="mb-2">
                <div className="flex items-center gap-2">
                  <strong
                    className={
                      result.passed ? "text-emerald-400" : "text-rose-400"
                    }
                  >
                    {result.status?.toUpperCase() ||
                      (result.passed ? "PASS" : "FAIL")}
                  </strong>
                  <span className="text-sm text-slate-500">
                    Input: {String(result.input)}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Expected: {String(result.expectedOutput)}
                </div>
                <div className="text-xs text-slate-500">
                  Actual: {String(result.actualOutput)}
                </div>
                <div className="text-xs text-slate-500">
                  Time: {result.executionTime}s · Memory: {result.memoryUsage}
                </div>
                {result.error && (
                  <div className="text-xs text-rose-400">{result.error}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OutputConsole;
