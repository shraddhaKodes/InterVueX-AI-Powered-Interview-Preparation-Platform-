import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUserProfile } from "../../api/authApi.js";

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setSettings(data.settings || data.user || {});
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const profile = settings || user || {};

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Settings
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Profile & preferences
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
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-[1.5rem] bg-slate-900/80"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Profile overview
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {profile.fullName || "Candidate"}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {profile.email || "No email available"}
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p>Bio: {profile.bio || "No bio added yet."}</p>
                <p>Skills: {(profile.skills || []).join(", ") || "None"}</p>
                <p>LeetCode: {profile.leetcodeURL || "Not provided"}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Preferences
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="font-semibold text-white">Streak</p>
                  <p className="mt-1">{profile.streak ?? 0} days</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="font-semibold text-white">Credits</p>
                  <p className="mt-1">{profile.credits ?? 0} remaining</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="font-semibold text-white">Linked accounts</p>
                  <p className="mt-1">Google login enabled</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
