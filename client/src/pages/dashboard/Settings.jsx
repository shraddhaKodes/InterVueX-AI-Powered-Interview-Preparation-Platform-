import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";

import { getMe, updateProfile } from "../../api/userApi.js";
import { getDashboardAnalytics } from "../../api/dashboardApi.js";

import SettingsSection from "../../components/settings/SettingsSection.jsx";
import FormField from "../../components/settings/FormField.jsx";
import SkillsEditor from "../../components/settings/SkillsEditor.jsx";
import LoadingSkeletonBlock from "../../components/settings/LoadingSkeletonBlock.jsx";
import ErrorBanner from "../../components/settings/ErrorBanner.jsx";

import api from "../../api/authApi.js";

const validateUrlOrEmpty = (value) => {
  if (!value) return true;
  try {
    // Accept values without protocol by treating them as invalid URLs
    // (Backend stores string; we prevent obvious junk)
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 20);
  }
  return [];
};

const Settings = () => {
  const { user } = useAuth();
  const theme = useContext(ThemeContext);
  const { darkMode } = theme || { darkMode: false };

  const [profile, setProfile] = useState(null);

  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState(null);
  const [creditUsage, setCreditUsage] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingCredits, setLoadingCredits] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const initialForm = useMemo(() => {
    const p = profile || user || {};
    return {
      fullName: p.fullName || "",
      bio: p.bio || "",
      githubURL: p.githubURL || "",
      linkedinURL: p.linkedinURL || "",
      portfolioURL: p.portfolioURL || "",
      leetcodeURL: p.leetcodeURL || "",
      skills: normalizeSkills(p.skills),
    };
  }, [profile, user]);

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setForm(initialForm);
    setFormErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialForm.fullName,
    initialForm.bio,
    initialForm.githubURL,
    initialForm.linkedinURL,
    initialForm.portfolioURL,
    initialForm.leetcodeURL,
    JSON.stringify(initialForm.skills),
  ]);

  const fetchAll = async () => {
    setLoadingProfile(true);
    setLoadingAnalytics(true);
    setLoadingPayments(true);
    setLoadingCredits(true);
    setSaveError("");

    try {
      const [meRes, analyticsRes] = await Promise.all([
        getMe(),
        getDashboardAnalytics(),
      ]);

      setProfile(meRes.user || meRes);
      setAnalytics(analyticsRes.analytics || analyticsRes);

      // payments
      try {
        const { data } = await api.get("/payments/history");
        // paymentController returns Payment docs array; some pages expect .payments
        setPayments(data?.payments || data);
      } catch (e) {
        setPayments(null);
      }

      // credit usage
      // Try common pagination defaults; backend uses validatePagination middleware.
      try {
        const { data } = await api.get("/credit-usage/history?page=1&limit=20");
        setCreditUsage(data);
      } catch (e) {
        setCreditUsage(null);
      }
    } finally {
      setLoadingProfile(false);
      setLoadingAnalytics(false);
      setLoadingPayments(false);
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const creditBalance = profile?.credits ?? user?.credits ?? 0;

  const validate = () => {
    const errors = {};

    if (!form.fullName || !form.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    if (form.bio && form.bio.length > 500) {
      errors.bio = "Bio must be 500 characters or less.";
    }

    if (form.githubURL && !validateUrlOrEmpty(form.githubURL)) {
      errors.githubURL = "Enter a valid URL (include https://).";
    }
    if (form.linkedinURL && !validateUrlOrEmpty(form.linkedinURL)) {
      errors.linkedinURL = "Enter a valid URL (include https://).";
    }
    if (form.portfolioURL && !validateUrlOrEmpty(form.portfolioURL)) {
      errors.portfolioURL = "Enter a valid URL (include https://).";
    }
    if (form.leetcodeURL && !validateUrlOrEmpty(form.leetcodeURL)) {
      errors.leetcodeURL = "Enter a valid URL (include https://).";
    }

    if (
      !Array.isArray(form.skills) ||
      form.skills.some((s) => !s || !String(s).trim())
    ) {
      errors.skills = "Skills must be a list of non-empty values.";
    }

    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const errors = validate();
    setFormErrors(errors);
    setSaveError("");

    if (Object.keys(errors).length) {
      toast.error("Please fix validation errors.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        bio: form.bio || "",
        githubURL: form.githubURL || "",
        linkedinURL: form.linkedinURL || "",
        portfolioURL: form.portfolioURL || "",
        leetcodeURL: form.leetcodeURL || "",
        skills: normalizeSkills(form.skills),
      };

      const res = await updateProfile(payload);
      const nextUser = res?.user || res?.data?.user || payload;

      setProfile((prev) => ({
        ...(prev || {}),
        ...(nextUser || {}),
        ...payload,
      }));
      toast.success("Profile updated successfully.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile";
      setSaveError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const analyticsCard = () => {
    if (loadingAnalytics) return <LoadingSkeletonBlock lines={5} />;
    if (!analytics)
      return <p className="text-sm text-slate-400">No analytics found.</p>;

    const a = analytics;
    return (
      <div className="space-y-3">
        <div className="rounded-3xl bg-slate-900/70 p-4">
          <p className="font-semibold text-white">Streak</p>
          <p className="mt-1 text-sm text-slate-200">{a.streak ?? 0} days</p>
        </div>
        <div className="rounded-3xl bg-slate-900/70 p-4">
          <p className="font-semibold text-white">Average Score</p>
          <p className="mt-1 text-sm text-slate-200">{a.averageScore ?? 0}%</p>
        </div>
        <div className="rounded-3xl bg-slate-900/70 p-4">
          <p className="font-semibold text-white">Interviews</p>
          <p className="mt-1 text-sm text-slate-200">
            {a.totalInterviews ?? 0} total
          </p>
        </div>
      </div>
    );
  };

  const latestActivity = () => {
    if (loadingAnalytics) return <LoadingSkeletonBlock lines={3} />;
    const logs = analytics?.activityLogs || [];

    if (!logs.length) {
      return <p className="text-sm text-slate-400">No activity logs yet.</p>;
    }

    return (
      <div className="space-y-3">
        {logs
          .slice()
          .sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt))
          .slice(0, 6)
          .map((log, idx) => (
            <div
              key={log.title + idx}
              className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {log.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{log.type}</p>
                </div>
                <p className="text-xs text-slate-400">
                  {log.loggedAt
                    ? new Date(log.loggedAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
              {log.description ? (
                <p className="mt-2 text-xs text-slate-300">{log.description}</p>
              ) : null}
            </div>
          ))}
      </div>
    );
  };

  const renderPayments = () => {
    if (loadingPayments) return <LoadingSkeletonBlock lines={6} />;

    const list = Array.isArray(payments) ? payments : payments?.payments || [];
    if (!list.length)
      return <p className="text-sm text-slate-400">No payments yet.</p>;

    return (
      <div className="space-y-3">
        {list.slice(0, 8).map((p, idx) => (
          <div
            key={p._id || idx}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  ₹{p.amount ?? 0}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Credits: {p.creditsPurchased ?? 0}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border capitalize ${
                  p.status === "completed"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : p.status === "failed"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {p.status || "pending"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderCredits = () => {
    if (loadingCredits) return <LoadingSkeletonBlock lines={5} />;

    // creditUsage response shape depends on pagination middleware; accept multiple shapes.
    const list =
      creditUsage?.creditUsage ||
      creditUsage?.data?.creditUsage ||
      creditUsage?.usage ||
      creditUsage?.results ||
      creditUsage?.credits ||
      creditUsage?.items ||
      creditUsage?.creditUsages ||
      creditUsage ||
      [];

    const arr = Array.isArray(list) ? list : list?.creditUsage || [];

    if (!arr.length)
      return <p className="text-sm text-slate-400">No credit usage history.</p>;

    return (
      <div className="space-y-3">
        {arr.slice(0, 10).map((u, idx) => (
          <div
            key={u._id || idx}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {u.featureUsed}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Credits consumed: {u.creditsConsumed ?? 0}
                </p>
              </div>
              <p className="text-xs text-slate-400">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Settings
          </p>
          <h2 className={`text-3xl font-semibold text-slate-900 ${darkMode ? "text-white" : ""}`}>
            Profile, Preferences & Account
          </h2>
        </div>
      </div>

      <motion.div
        className="dashboard-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        {loadingProfile ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
              <LoadingSkeletonBlock lines={10} />
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
              <LoadingSkeletonBlock lines={8} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left: Profile edit form */}
              <SettingsSection
                title="Profile"
                subtitle="Update your candidate information"
                right={
                  <div className="text-right">
                    <p
                      className={
                        darkMode
                          ? "text-xs text-slate-400"
                          : "text-xs text-slate-500"
                      }
                    >
                      Current balance
                    </p>
                    <p
                      className={
                        darkMode
                          ? "text-xl font-semibold text-white"
                          : "text-xl font-semibold text-slate-900"
                      }
                    >
                      {creditBalance} Credits
                    </p>
                  </div>
                }
              >
                <form onSubmit={onSubmit} className="space-y-5">
                  <ErrorBanner message={saveError} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Full name"
                      required
                      error={formErrors.fullName}
                    >
                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, fullName: e.target.value }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40"
                        placeholder="Your name"
                        disabled={saving}
                      />
                    </FormField>

                    <div>
                      <p className="text-sm font-medium text-white">Email</p>
                      <p className="mt-2 text-sm text-slate-300">
                        {profile?.email || user?.email || ""}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        Email updates are handled via account flows.
                      </p>
                    </div>
                  </div>

                  <FormField
                    label="Bio"
                    hint="Short intro (optional)"
                    error={formErrors.bio}
                  >
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, bio: e.target.value }))
                      }
                      rows={4}
                      className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40"
                      placeholder="Tell us about your background"
                      disabled={saving}
                      maxLength={800}
                    />
                  </FormField>

                  <FormField
                    label="Skills"
                    hint="Comma-separated"
                    error={formErrors.skills}
                  >
                    <SkillsEditor
                      value={form.skills}
                      onChange={(skills) => setForm((s) => ({ ...s, skills }))}
                    />
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="GitHub" error={formErrors.githubURL}>
                      <input
                        value={form.githubURL}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, githubURL: e.target.value }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40"
                        placeholder="https://github.com/username"
                        disabled={saving}
                      />
                    </FormField>

                    <FormField label="LinkedIn" error={formErrors.linkedinURL}>
                      <input
                        value={form.linkedinURL}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            linkedinURL: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40"
                        placeholder="https://linkedin.com/in/username"
                        disabled={saving}
                      />
                    </FormField>

                    <FormField
                      label="Portfolio"
                      error={formErrors.portfolioURL}
                    >
                      <input
                        value={form.portfolioURL}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            portfolioURL: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40"
                        placeholder="https://your-site.com"
                        disabled={saving}
                      />
                    </FormField>

                    <FormField label="LeetCode" error={formErrors.leetcodeURL}>
                      <input
                        value={form.leetcodeURL}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            leetcodeURL: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40"
                        placeholder="https://leetcode.com/username"
                        disabled={saving}
                      />
                    </FormField>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Updates apply to your public profile and interview
                      suggestions.
                    </p>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-indigo-500/20 px-5 py-3 text-white border border-indigo-500/30 hover:bg-indigo-500/25 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </form>
              </SettingsSection>

              {/* Right: Analytics + last activity */}
              <div className="space-y-6">
                <SettingsSection
                  title="Interview analytics"
                  subtitle="Your progress signals"
                >
                  {analyticsCard()}
                </SettingsSection>

                <SettingsSection
                  title="Recent activity"
                  subtitle="Last 6 recorded events"
                >
                  {latestActivity()}
                </SettingsSection>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SettingsSection
                title="Credits & usage"
                subtitle="How credits are spent"
              >
                {renderCredits()}
              </SettingsSection>

              <SettingsSection
                title="Payments"
                subtitle="Your credit purchases"
              >
                {renderPayments()}
              </SettingsSection>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SettingsSection title="Security" subtitle="Account protection">
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-sm font-semibold text-white">
                      Password reset
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Use the existing password reset flow to update your
                      password.
                    </p>
                    <div className="mt-4">
                      <a
                        href="/password/reset"
                        className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-white border border-white/10 hover:bg-white/15"
                      >
                        Go to reset page
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Provider:{" "}
                    {profile?.authProvider || user?.authProvider || "local"}
                  </p>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Professional details"
                subtitle="Shown on your profile"
              >
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs text-slate-400">Bio</p>
                    <p className="mt-2">
                      {profile?.bio ? profile.bio : "No bio added yet."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs text-slate-400">Skills</p>
                    <p className="mt-2">
                      {(profile?.skills || []).length
                        ? (profile.skills || []).join(", ")
                        : "None"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs text-slate-400">Links</p>
                    <div className="mt-2 space-y-2">
                      <p>
                        <span className="text-slate-400">GitHub:</span>{" "}
                        {profile?.githubURL || "Not provided"}
                      </p>
                      <p>
                        <span className="text-slate-400">LinkedIn:</span>{" "}
                        {profile?.linkedinURL || "Not provided"}
                      </p>
                      <p>
                        <span className="text-slate-400">Portfolio:</span>{" "}
                        {profile?.portfolioURL || "Not provided"}
                      </p>
                      <p>
                        <span className="text-slate-400">LeetCode:</span>{" "}
                        {profile?.leetcodeURL || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
