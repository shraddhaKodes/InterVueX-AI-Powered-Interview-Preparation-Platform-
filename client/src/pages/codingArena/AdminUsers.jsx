import { useEffect, useMemo, useState, useContext } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { useAdminUsersStore } from "../../store/adminUsersStore.js";

const AdminUsers = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const { users, loading, fetchUsers } = useAdminUsersStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }

    fetchUsers({ limit: 1000 });
  }, [isAuthenticated, user, fetchUsers, navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const fullName = (u.fullName || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return fullName.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [users, query]);

  const panelClass = darkMode
    ? "dashboard-panel bg-slate-950/80 text-slate-100"
    : "dashboard-panel bg-white/95 text-slate-900";

  return (
    <div className="space-y-6 p-6">
      <div className="dashboard-heading flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, role"
            className="rounded-md border px-3 py-2 bg-transparent w-[320px]"
          />
        </div>

        <div className="text-sm text-slate-500">{filtered.length} users</div>
      </div>

      <div className="overflow-x-auto">
        <div className={panelClass}>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Credits</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="py-3">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={
                          u.role === "admin"
                            ? "inline-flex items-center rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-500"
                            : "inline-flex items-center rounded-full bg-slate-500/15 px-3 py-1 text-xs font-bold text-slate-500"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{typeof u.credits === "number" ? u.credits : "-"}</td>
                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
