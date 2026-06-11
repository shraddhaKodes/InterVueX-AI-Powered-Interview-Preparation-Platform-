import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from "../../api/paymentApi";
import { getAdminPaymentHistory } from "../../api/adminPaymentApi";
import { CREDIT_PACKS } from "../../constants/creditPacks";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

const Payment = () => {
  const { payments, loading, loadPayments } = useDashboardStore();
  const { user } = useAuth();
  const theme = useContext(ThemeContext);

  const [buyingIndex, setBuyingIndex] = useState(null);
  const [data, setdata] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // Fallback styling configurations based directly on ThemeContext
  const isDark = theme?.darkMode;
  const headingColor = isDark ? "text-white" : "text-slate-900";
  const textColor = isDark ? "text-slate-100" : "text-slate-800";
  const subtextColor = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-white/10" : "border-slate-200";
  const cardBg = isDark ? "bg-slate-900/50" : "bg-slate-50";

  const fetchData = async () => {
    try {
      setLocalLoading(true);
      const isAdmin = user?.role === "admin";
      const paymentData = isAdmin
        ? await getAdminPaymentHistory()
        : await getPaymentHistory();

      if (paymentData && paymentData.payments) {
        setdata(paymentData.payments);
      } else if (Array.isArray(paymentData)) {
        setdata(paymentData);
      } else {
        setdata([]);
      }
    } catch (error) {
      console.error("Failed to read transaction historical logs:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBuy = async (packIndex) => {
    try {
      setBuyingIndex(packIndex);

      const orderRes = await createOrder(packIndex);

      if (!orderRes || !orderRes.orderId) {
        throw new Error(
          "Backend could not synthesize a valid order identity token.",
        );
      }

      const options = {
        key: orderRes.key,
        amount: Math.round(
          (orderRes.amount || CREDIT_PACKS[packIndex].amount) * 100,
        ),
        currency: "INR",
        name: "IntervueX (Test Mode)",
        description: `Buy ${orderRes.credits || CREDIT_PACKS[packIndex].credits} Credits`,
        order_id: orderRes.orderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful! Credits added.");

            await loadPayments();
            await fetchData();
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Payment verification failed.",
            );
          } finally {
            setBuyingIndex(null);
          }
        },
        modal: {
          ondismiss: function () {
            setBuyingIndex(null);
            toast.info("Payment sequence cancelled.");
          },
        },
        prefill: {
          name: "IntervueX User",
          email: "testuser@intervuex.com",
        },
        theme: {
          color: isDark ? "#0f172a" : "#2563eb",
          backdrop_color: isDark ? "#0b1220" : "#ffffff",
        },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay web instance script missing. Please reload.");
        setBuyingIndex(null);
        return;
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setBuyingIndex(null);
        toast.error(
          response?.error?.description || "Payment instance processing failed.",
        );
      });

      razorpay.open();
    } catch (error) {
      setBuyingIndex(null);
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to trigger order.",
      );
    }
  };

  const isDataLoading = loading || localLoading;

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className={`text-sm uppercase tracking-[0.24em] ${subtextColor}`}>
            Payments
          </p>
          <h2 className={`text-3xl font-semibold ${headingColor}`}>
            Credit Wallet
          </h2>
        </div>
      </div>

      <motion.div
        className="dashboard-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        {isDataLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`loading-skeleton-${index}`}
                className={`h-32 rounded-xl animate-pulse ${
                  isDark ? "bg-slate-900/80" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div
              className={`rounded-2xl border p-6 ${borderColor} ${isDark ? "bg-slate-950/70" : "bg-white"}`}
            >
              <p
                className={`text-sm uppercase tracking-[0.24em] ${subtextColor}`}
              >
                Current Balance
              </p>
              <h3
                className={`mt-3 text-4xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {payments?.balance || 0} Credits
              </h3>
            </div>

            <div>
              <h3 className={`mb-4 text-xl font-semibold ${headingColor}`}>
                Buy Credits
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {CREDIT_PACKS.map((pack, index) => {
                  const isCurrentCardBuying = buyingIndex === index;
                  const isAnyCardBuying = buyingIndex !== null;

                  return (
                    <div
                      key={`pack-render-index-${index}`}
                      className={`rounded-xl border p-5 ${borderColor} ${cardBg}`}
                    >
                      <h3 className={`text-xl font-semibold ${textColor}`}>
                        {pack.name}
                      </h3>
                      <p className={`mt-2 ${subtextColor}`}>
                        {pack.credits} Credits
                      </p>
                      <p className={`mt-3 text-3xl font-bold ${textColor}`}>
                        ₹{pack.amount}
                      </p>
                      <button
                        onClick={() => onBuy(index)}
                        disabled={isAnyCardBuying}
                        className={`mt-4 w-full rounded-lg px-4 py-3 font-medium transition disabled:opacity-50 ${
                          isDark
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isCurrentCardBuying ? "Processing..." : "Buy Now"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className={`mb-4 text-xl font-semibold ${headingColor}`}>
                Transaction History
              </h3>
              <div className="grid gap-4">
                {data.length === 0 ? (
                  <p className={`text-sm ${subtextColor}`}>
                    No transactions found.
                  </p>
                ) : (
                  data.map((transaction, idx) => (
                    <div
                      key={transaction._id || `tx-element-${idx}`}
                      className={`rounded-xl border p-5 ${borderColor} ${isDark ? "bg-slate-950/70" : "bg-white"}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-lg font-semibold ${textColor}`}>
                            ₹{transaction.amount}
                          </p>

                          {/* Dynamic Status Badge */}
                          <div className="mt-1.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border capitalize ${
                                transaction.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : transaction.status === "failed"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {/* Status Indicator Dot */}
                              <span
                                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                  transaction.status === "completed"
                                    ? "bg-emerald-400"
                                    : transaction.status === "failed"
                                      ? "bg-rose-400"
                                      : "bg-amber-400"
                                }`}
                              />
                              {transaction.status || "pending"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          {transaction.user ? (
                            <p className={`text-sm font-medium ${textColor}`}>
                              {transaction.user.fullName ||
                                transaction.user.email}
                            </p>
                          ) : (
                            <p className={`text-sm ${subtextColor}`}>User</p>
                          )}
                          <p className={`text-sm ${subtextColor}`}>
                            {transaction.createdAt
                              ? new Date(
                                  transaction.createdAt,
                                ).toLocaleDateString()
                              : "Recent"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Payment;
