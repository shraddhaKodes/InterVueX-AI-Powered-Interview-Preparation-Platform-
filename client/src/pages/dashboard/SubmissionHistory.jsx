import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { listSubmissions } from "../../api/codingSubmissionApi";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await listSubmissions();
        setSubmissions(res.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, []);

  const toggleCodeView = (submissionId) => {
    setExpandedSubmission(
      expandedSubmission === submissionId ? null : submissionId
    );
  };

  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Submissions
          </p>

          <h2
            className={`text-3xl font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Your Recent Submissions
          </h2>
        </div>
      </div>

      <div className="dashboard-panel mt-6">
        {submissions.length === 0 ? (
          <div
            className={`rounded-xl border p-8 text-center ${
              darkMode
                ? "border-slate-700 bg-slate-900 text-slate-400"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            No submissions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className={`rounded-xl border p-5 transition-all duration-200 ${
                  darkMode
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Left Side */}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {submission.problemTitle}
                    </h3>

                    <p
                      className={`mt-1 text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Language: {submission.language}
                    </p>

                    <div
                      className={`mt-3 flex flex-wrap gap-4 text-sm ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <span>
                        Runtime:{" "}
                        <strong>
                          {submission.executionTime ??
                            submission.runtime ??
                            0}{" "}
                          ms
                        </strong>
                      </span>

                      <span>
                        Memory:{" "}
                        <strong>
                          {submission.memoryUsage ??
                            submission.memory ??
                            0}{" "}
                          KB
                        </strong>
                      </span>

                      <span>
                        Test Cases:{" "}
                        <strong>
                          {submission.passedTestCases}/
                          {submission.totalTestCases}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        submission.verdict?.toLowerCase() === "accepted"
                          ? darkMode
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-100 text-green-700"
                          : darkMode
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submission.verdict?.toUpperCase()}
                    </span>

                    <span
                      className={`text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>

                    <button
                      onClick={() => toggleCodeView(submission._id)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        darkMode
                          ? "border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                          : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {expandedSubmission === submission._id
                        ? "Hide Code"
                        : "View Code"}
                    </button>
                  </div>
                </div>

                {/* Code Viewer */}
                {expandedSubmission === submission._id && (
                  <div className="mt-5">
                    <pre
                      className={`overflow-x-auto rounded-xl border p-4 text-sm ${
                        darkMode
                          ? "border-slate-700 bg-slate-950 text-green-300"
                          : "border-slate-300 bg-slate-100 text-slate-900"
                      }`}
                    >
                      <code>
                        {submission.sourceCode ||
                          submission.code ||
                          "No code available"}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;