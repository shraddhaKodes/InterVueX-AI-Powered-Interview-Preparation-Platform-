import { Link, useLocation } from "react-router-dom";

const AdminCodingTabs = () => {
  const location = useLocation();

  const active = (path) => location.pathname.endsWith(path);

  return (
    <div className="flex gap-2 mb-6">
      <Link
        to="/dashboard/coding/admin"
        className={
          active("/admin")
            ? "px-4 py-2 rounded-xl bg-cyan-500 text-white text-sm font-bold"
            : "px-4 py-2 rounded-xl bg-slate-500/10 text-slate-600 text-sm font-bold hover:bg-slate-500/20"
        }
      >
        Problems
      </Link>
      <Link
        to="/dashboard/coding/admin/submissions"
        className={
          active("/admin/submissions")
            ? "px-4 py-2 rounded-xl bg-cyan-500 text-white text-sm font-bold"
            : "px-4 py-2 rounded-xl bg-slate-500/10 text-slate-600 text-sm font-bold hover:bg-slate-500/20"
        }
      >
        Submissions
      </Link>
      <Link
        to="/dashboard/coding/admin/users"
        className={
          active("/admin/users")
            ? "px-4 py-2 rounded-xl bg-cyan-500 text-white text-sm font-bold"
            : "px-4 py-2 rounded-xl bg-slate-500/10 text-slate-600 text-sm font-bold hover:bg-slate-500/20"
        }
      >
        Users
      </Link>
    </div>
  );
};

export default AdminCodingTabs;
