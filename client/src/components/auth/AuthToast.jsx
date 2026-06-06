import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const AuthToast = ({ toast }) => {
  const isSuccess = toast?.type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <AnimatePresence>
      {toast?.message && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          className={`auth-toast ${isSuccess ? "auth-toast-success" : "auth-toast-error"}`}
        >
          <Icon size={18} />
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthToast;

