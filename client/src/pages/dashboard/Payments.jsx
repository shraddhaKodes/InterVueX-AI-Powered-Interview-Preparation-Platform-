import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDashboardStore } from "../../store/dashboardStore.js";

const Payments = () => {
  const { payments, loading, loadPayments } = useDashboardStore();

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Payments
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Credit wallet
          </h2>
        </div>
      </div>

      <motion.div
        className="dashboard-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-[1.5rem] bg-slate-900/80"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Current balance
              </p>
              <h3 className="mt-3 text-4xl font-semibold text-white">
                {payments.balance} credits
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use credits for AI interviews, mock sessions, and expert review.
              </p>
            </div>

            <div className="grid gap-4">
              {payments.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        {transaction.title}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        ₹{transaction.amount}
                      </p>
                    </div>
                    <div className="text-sm text-slate-400">
                      {transaction.date}
                    </div>
                  </div>
                  <span className="mt-4 inline-flex rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                    {transaction.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Payments;
