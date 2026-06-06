import { useState, useContext } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { ThemeContext } from "../../../context/ThemeContext.jsx";

const ProblemTable = ({ problems = [], onEdit, onDelete }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const { darkMode } = useContext(ThemeContext);

  const filtered = problems.filter((p) => {
    if (
      filter &&
      !p.title.toLowerCase().includes(filter.toLowerCase()) &&
      !p.slug.toLowerCase().includes(filter.toLowerCase())
    )
      return false;
    if (difficulty && p.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            placeholder="Search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border px-3 py-2 bg-transparent"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-md border px-3 py-2 bg-transparent"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="text-sm text-slate-500">{filtered.length} problems</div>
      </div>

      <div className="overflow-x-auto">
        <div
          className={
            darkMode
              ? "dashboard-panel bg-slate-950/80 text-slate-100"
              : "dashboard-panel bg-white/95 text-slate-900"
          }
        >
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th>Title</th>
                <th>Slug</th>
                <th>Difficulty</th>
                <th>Tests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="py-3">{p.title}</td>
                  <td>{p.slug}</td>
                  <td>{p.difficulty}</td>
                  <td>
                    {(p.visibleTestCases?.length || 0) +
                      (p.hiddenTestCases?.length || 0)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(p)} className="btn-primary">
                        Edit
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => onDelete(p)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProblemTable;
