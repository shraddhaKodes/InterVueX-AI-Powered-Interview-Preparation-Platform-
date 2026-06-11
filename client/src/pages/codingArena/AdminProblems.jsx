import { useEffect, useState } from "react";
import { useProblemAdminStore } from "../../store/problemAdminStore.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ProblemTable from "../../components/codingArena/admin/ProblemTable.jsx";
import ProblemForm from "../../components/codingArena/admin/ProblemForm.jsx";
import DeleteProblemModal from "../../components/codingArena/admin/DeleteProblemModal.jsx";
import AdminCodingTabs from "../../components/codingArena/admin/AdminCodingTabs.jsx";

const AdminProblems = () => {
  const { problems, fetchProblems } = useProblemAdminStore();
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow admins
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }

    fetchProblems();
  }, [isAuthenticated, user]);

  return (
    <div className="space-y-6 p-6">
      <div className="dashboard-heading flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Coding (Admin)</h2>
      </div>

      {/* Tabs */}
      <AdminCodingTabs />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-1">
          <div className="dashboard-panel p-4">
            <ProblemForm
              key={editing?._id || "new"}
              problem={editing}
              onDone={() => setEditing(null)}
            />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="dashboard-panel p-4">
            <ProblemTable
              problems={problems}
              onEdit={(p) => setEditing(p)}
              onDelete={(p) => {
                setToDelete(p);
                setShowDelete(true);
              }}
            />
          </div>
        </div>
      </div>

      <DeleteProblemModal
        open={showDelete}
        problem={toDelete}
        onClose={() => setShowDelete(false)}
      />
    </div>
  );
};

export default AdminProblems;
