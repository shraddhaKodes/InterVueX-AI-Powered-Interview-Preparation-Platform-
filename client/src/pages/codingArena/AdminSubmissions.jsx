import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { listAdminSubmissions } from "../../api/adminCodingSubmissionsApi.js";

const AdminSubmissions = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep it simple for now: only implement pagination.
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await listAdminSubmissions({ page, limit });
        // API wrapper may return either { submissions } or { data: { submissions } }
        const submissionsList =
          res?.submissions || res?.data?.submissions || [];
        setSubmissions(submissionsList);
      } catch (e) {
        console.error("AdminSubmissions fetch error:", e?.response?.data || e);

        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate, page]);

  const panelClass = darkMode
    ? "dashboard-panel bg-slate-950/80 text-slate-100"
    : "dashboard-panel bg-white/95 text-slate-900";

  return (
    <div className="space-y-6 p-6">
      <div className="dashboard-heading flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Admin Coding Submissions</h2>
      </div>

      <div className={panelClass}>
        {error ? <div className="p-4 text-sm text-red-500">{error}</div> : null}

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th>User</th>
                <th>Problem</th>
                <th>Language</th>
                <th>Verdict</th>
                <th>Score</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="py-3">
                      {user.fullName || "-"}
                      <div className="text-xs text-slate-500">
                        {user.email || ""}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">
                        {s.problemTitle || s.problem?.title || "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {s.problem?.slug ? `/${s.problem.slug}` : ""}
                      </div>
                    </td>
                    <td>{s.language || "-"}</td>
                    <td>
                      <span
                        className={
                          s.verdict?.toLowerCase() === "accepted"
                            ? "inline-flex items-center rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-600"
                            : "inline-flex items-center rounded-full bg-slate-500/15 px-3 py-1 text-xs font-bold text-slate-600"
                        }
                      >
                        {String(s.verdict || "pending").toUpperCase()}
                      </span>
                    </td>
                    <td>{typeof s.score === "number" ? s.score : "-"}</td>
                    <td>
                      {typeof s.executionTime === "number"
                        ? `${s.executionTime} ms`
                        : "-"}
                    </td>
                    <td>
                      {typeof s.memoryUsage === "number"
                        ? `${s.memoryUsage} KB`
                        : "-"}
                    </td>
                    <td>
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-4">
          <button
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <div className="text-sm text-slate-500">Page {page}</div>
          <button
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            disabled={loading || submissions.length < limit}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;
