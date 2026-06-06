import { useEffect, useContext } from "react";
import { useProblemAdminStore } from "../../../store/problemAdminStore.js";
import { ThemeContext } from "../../../context/ThemeContext.jsx";

const DeleteProblemModal = ({ open, problem, onClose }) => {
  const { deleteProblem } = useProblemAdminStore();

  useEffect(() => {
    if (!open) return;
  }, [open]);

  const { darkMode } = useContext(ThemeContext);

  if (!open || !problem) return null;

  const confirm = async () => {
    try {
      await deleteProblem(problem._id);
      onClose && onClose();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={
          darkMode
            ? "dashboard-panel w-full max-w-md bg-slate-950/80 text-slate-100"
            : "dashboard-panel w-full max-w-md bg-white/95 text-slate-900"
        }
      >
        <h3 className="text-lg font-semibold">Delete Problem</h3>
        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete "{problem.title}"? This action cannot
          be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={confirm} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProblemModal;
